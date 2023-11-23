import { Model } from 'mongoose';
import { Writable } from 'stream';
import { ValidateFunction } from 'ajv';
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

@Injectable()
export class DoReReview extends BaseReview {
  private _modal: Model<any>;

  constructor(
    private dalService: DalService,
    private uploadRepository: UploadRepository,
    private validatorRepository: ValidatorRepository
  ) {
    super();
  }

  async execute(_uploadId: string) {
    this._modal = this.dalService.getRecordCollection(_uploadId);

    const uploadInfo = await this.uploadRepository.findById(_uploadId);
    if (!uploadInfo) {
      throw new BadRequestException(APIMessages.UPLOAD_NOT_FOUND);
    }
    const dateFormats: Record<string, string[]> = {};
    const uniqueItems: Record<string, Set<any>> = {};
    const schema = this.buildAJVSchema({
      columns: JSON.parse(uploadInfo.customSchema),
      dateFormats,
      uniqueItems,
    });
    const ajv = this.getAjvValidator(dateFormats, uniqueItems);
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
        dateFormats,
        uploadId: _uploadId,
        extra: uploadInfo.extra,
        onBatchInitialize: validations.onBatchInitialize,
      });
    } else {
      response = await this.normalValidate({
        uploadId: _uploadId,
        validator,
        dateFormats,
      });
    }

    await this.saveResults(response);

    return response;
  }

  private async normalValidate({
    dateFormats,
    uploadId,
    validator,
  }: {
    dateFormats: Record<string, string[]>;
    uploadId: string;
    validator: ValidateFunction;
  }) {
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
        dateFormats,
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
    dateFormats,
    onBatchInitialize,
  }: {
    extra: any;
    uploadId: string;
    onBatchInitialize: string;
    validator: ValidateFunction;
    dateFormats: Record<string, string[]>;
  }) {
    const { dataStream } = this.getStreams({
      uploadId,
    });
    const batches = await this.prepareBatches({
      extra,
      uploadId,
      validator,
      dateFormats,
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
    dateFormats,
  }: {
    extra: any;
    uploadId: string;
    validator: ValidateFunction;
    dateFormats: Record<string, string[]>;
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
        dateFormats,
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
