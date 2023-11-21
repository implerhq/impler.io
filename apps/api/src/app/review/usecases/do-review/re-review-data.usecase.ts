import * as dayjs from 'dayjs';
import { Model } from 'mongoose';
import { Writable } from 'stream';
import addFormats from 'ajv-formats';
import addKeywords from 'ajv-keywords';
import Ajv, { AnySchemaObject, ValidateFunction } from 'ajv';
import { Injectable, BadRequestException } from '@nestjs/common';

import { UploadStatusEnum } from '@impler/shared';
import { UploadRepository, ValidatorRepository, DalService } from '@impler/dal';

import { APIMessages } from '@shared/constants';
import { BATCH_LIMIT } from '@shared/services/sandbox';
import { BaseReview } from './base-review.usecase';

interface ISaveResults {
  uploadId: string;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
}
interface IDataItem {
  index: number;
  errors?: Record<string, string>;
  isValid: boolean;
  record: Record<string, any>;
  updated: Record<string, boolean>;
}
interface IBatchItem {
  uploadId: string;
  data: IDataItem[];
  batchCount: number;
  extra: any;
  // totalRecords: number;
}

const ajv = new Ajv({
  allErrors: true,
  coerceTypes: true,
  useDefaults: 'empty',
  allowUnionTypes: true,
  // removeAdditional: true,
  verbose: true,
});
addFormats(ajv, ['email']);
addKeywords(ajv);
let dateFormats: Record<string, string[]> = {};
ajv.addKeyword('customDateChecker', {
  keyword: 'customDateChecker',
  validate: function (_valid, date, _schema, dataPath) {
    return dayjs(date, dateFormats[dataPath.parentDataProperty]).isValid();
  },
});

// Empty keyword
ajv.addKeyword({
  keyword: 'emptyCheck',
  schema: false,
  compile: () => {
    return (data) => (data === undefined || data === null || data === '' ? false : true);
  },
});

let uniqueItems: Record<string, Set<any>> = {};
ajv.addKeyword({
  keyword: 'uniqueCheck',
  schema: false, // keyword value is not used, can be true
  validate: function (data: any, dataPath: AnySchemaObject) {
    if (uniqueItems[dataPath.parentDataProperty].has(data)) {
      return false;
    }
    uniqueItems[dataPath.parentDataProperty].add(data);

    return true;
  },
});

@Injectable()
export class DoReReview extends BaseReview {
  private _modal: Model<any>;

  constructor(
    private dalService: DalService,
    private uploadRepository: UploadRepository,
    private validatorRepository: ValidatorRepository
  ) {
    super(dateFormats);
  }

  async execute(_uploadId: string) {
    this._modal = this.dalService.getRecordCollection(_uploadId);

    const uploadInfo = await this.uploadRepository.findById(_uploadId);
    if (!uploadInfo) {
      throw new BadRequestException(APIMessages.UPLOAD_NOT_FOUND);
    }
    const schema = this.buildAJVSchema(JSON.parse(uploadInfo.customSchema), uniqueItems);
    const validator = ajv.compile(schema);

    const validations = await this.validatorRepository.findOne({ _templateId: uploadInfo._templateId });

    let response: ISaveResults = {
      uploadId: _uploadId,
      totalRecords: 0,
      validRecords: 0,
      invalidRecords: 0,
    };

    if (validations && validations.onBatchInitialize) {
      response = await this.batchValidate({
        validator,
        uploadId: _uploadId,
        extra: uploadInfo.extra,
        onBatchInitialize: validations.onBatchInitialize,
      });
    } else {
      response = await this.normalValidate({
        uploadId: _uploadId,
        validator,
      });
    }

    // resetting uniqueItems & dateFormats
    uniqueItems = {};
    dateFormats = {};

    await this.saveResults(response);

    return response;
  }

  private async normalValidate({ uploadId, validator }: { uploadId: string; validator: ValidateFunction }) {
    const bulkOp = this.dalService.getRecordBulkOp(uploadId);
    const response: ISaveResults = {
      uploadId,
      totalRecords: 0,
      validRecords: 0,
      invalidRecords: 0,
    };

    for await (const record of this._modal.find()) {
      const validationResult = this.validateRecord({
        index: record.index,
        record: record.record,
        validator,
      });
      response.totalRecords++;
      if (validationResult.isValid) {
        response.validRecords++;
      } else {
        response.invalidRecords++;
      }
      bulkOp.find({ index: record.index }).updateOne({ $set: { ...validationResult } });
    }
    await bulkOp.execute();

    return response;
  }

  getStreams({ uploadId }: { uploadId: string }) {
    const bulkOp = this.dalService.getRecordBulkOp(uploadId);
    const dataStream = new Writable({
      objectMode: true,
      async write(record, encoding, callback) {
        bulkOp.find({ index: record.index }).updateOne({ $set: record });
        callback();
      },
      async final(callback) {
        try {
          await bulkOp.execute();
        } catch (error) {}
        callback();
      },
    });

    return {
      dataStream,
    };
  }

  private async batchValidate({
    extra,
    uploadId,
    validator,
    onBatchInitialize,
  }: {
    extra: any;
    uploadId: string;
    onBatchInitialize: string;
    validator: ValidateFunction;
  }) {
    const { dataStream } = this.getStreams({
      uploadId,
    });
    const batches = await this.prepareBatches({
      extra,
      uploadId,
      validator,
    });

    return await this.processBatches({
      batches,
      uploadId,
      dataStream,
      onBatchInitialize,
    });
  }

  private async prepareBatches({
    extra,
    uploadId,
    validator,
  }: {
    extra: any;
    uploadId: string;
    validator: ValidateFunction;
  }) {
    let batchCount = 1;
    const batches: IBatchItem[] = [];
    const batchRecords: IDataItem[] = [];
    if (!this._modal) {
      console.log(`Modal not found for upload ${uploadId}`, this._modal);
      this._modal = this.dalService.getRecordCollection(uploadId);
    }

    for await (const record of this._modal.find()) {
      const validationResultItem = this.validateRecord({
        index: record.index,
        record: record.record,
        validator,
      });
      batchRecords.push(validationResultItem);
      if (batchRecords.length === BATCH_LIMIT) {
        batches.push(
          JSON.parse(
            JSON.stringify({
              uploadId,
              data: batchRecords,
              batchCount,
              extra,
            })
          )
        );
        batchRecords.length = 0;
        batchCount++;
      }
    }
    if (batchRecords.length > 0) {
      batches.push(
        JSON.parse(
          JSON.stringify({
            uploadId,
            data: batchRecords,
            batchCount,
            extra,
          })
        )
      );
    }

    return batches;
  }

  private async saveResults({ uploadId, totalRecords, validRecords, invalidRecords }: ISaveResults) {
    await this.uploadRepository.update(
      { _id: uploadId },
      {
        status: UploadStatusEnum.REVIEWING,
        totalRecords,
        validRecords,
        invalidRecords,
      }
    );
  }
}
