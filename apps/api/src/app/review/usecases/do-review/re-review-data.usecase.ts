import { Model } from 'mongoose';
import { Writable } from 'stream';
import { ValidateFunction } from 'ajv';
import { Injectable, BadRequestException } from '@nestjs/common';

import { ITemplateSchemaItem, UploadStatusEnum } from '@impler/shared';
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

    const columns = JSON.parse(uploadInfo.customSchema) as ITemplateSchemaItem[];
    const uniqueFields = columns.filter((column) => column.isUnique).map((column) => column.key);
    const uniqueFieldData = uniqueFields.length ? await this.dalService.getFieldData(_uploadId, uniqueFields) : [];
    const multiSelectColumnHeadings = [];
    (columns as ITemplateSchemaItem[]).forEach((column) => {
      if (column.allowMultiSelect) multiSelectColumnHeadings.push(column.key);
    });

    uniqueFieldData.forEach((item) => {
      uniqueFields.forEach((field) => {
        if (!uniqueItems[field]) uniqueItems[field] = new Set();
        uniqueItems[field].add(item.record[field]);
      });
    });

    let result: ISaveResults = {
      uploadId: _uploadId,
      totalRecords: uploadInfo.totalRecords,
      validRecords: uploadInfo.validRecords,
      invalidRecords: uploadInfo.invalidRecords,
    };

    if (validations && validations.onBatchInitialize) {
      result = await this.batchValidate({
        result,
        validator,
        dateFormats,
        uploadId: _uploadId,
        extra: uploadInfo.extra,
        multiSelectColumnHeadings,
        onBatchInitialize: validations.onBatchInitialize,
      });
    } else {
      result = await this.normalValidate({
        uploadId: _uploadId,
        validator,
        dateFormats,
        result,
        multiSelectColumnHeadings,
      });
    }

    await this.saveResults(result);

    return result;
  }

  private async normalValidate({
    result,
    uploadId,
    validator,
    dateFormats,
    multiSelectColumnHeadings,
  }: {
    uploadId: string;
    result: ISaveResults;
    validator: ValidateFunction;
    multiSelectColumnHeadings: string[];
    dateFormats: Record<string, string[]>;
  }) {
    const bulkOp = this.dalService.getRecordBulkOp(uploadId);
    const response: ISaveResults = {
      uploadId,
      totalRecords: 0,
      validRecords: result.validRecords,
      invalidRecords: result.invalidRecords,
    };

    for await (const record of this._modal.find({ updated: { $ne: {}, $exists: true } })) {
      const checkRecord: Record<string, unknown> = multiSelectColumnHeadings.reduce((acc, heading) => {
        if (heading === '_') return acc;

        if (multiSelectColumnHeadings.includes(heading)) {
          acc[heading] = record.record[heading]?.split(',');
        }

        return acc;
      }, record.record);
      const validationResult = this.validateRecord({
        validator,
        checkRecord,
        dateFormats,
        index: record.index,
        passRecord: record.record,
      });
      response.totalRecords++;
      if (record.isValid && !validationResult.isValid) {
        response.validRecords--;
        response.invalidRecords++;
      } else if (!record.isValid && validationResult.isValid) {
        response.invalidRecords--;
        response.validRecords++;
      }
      bulkOp.find({ index: record.index }).updateOne({ $set: { ...validationResult } });
    }
    if (response.totalRecords > 0) {
      await bulkOp.execute();
    }

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
    result,
    uploadId,
    validator,
    dateFormats,
    onBatchInitialize,
    multiSelectColumnHeadings,
  }: {
    extra: any;
    uploadId: string;
    result: ISaveResults;
    onBatchInitialize: string;
    validator: ValidateFunction;
    multiSelectColumnHeadings: string[];
    dateFormats: Record<string, string[]>;
  }) {
    const { dataStream } = this.getStreams({
      uploadId,
    });
    const { batches, resultObj } = await this.prepareBatches({
      extra,
      uploadId,
      validator,
      dateFormats,
      multiSelectColumnHeadings,
    });

    await this.processBatches({
      batches,
      uploadId,
      dataStream,
      onBatchInitialize,
      forItem(item) {
        if (resultObj[item.index] && !item.isValid) {
          result.validRecords--;
          result.invalidRecords++;
        } else if (!resultObj[item.index] && item.isValid) {
          result.invalidRecords--;
          result.validRecords++;
        }
      },
    });

    return result;
  }

  private async prepareBatches({
    extra,
    uploadId,
    validator,
    dateFormats,
    multiSelectColumnHeadings,
  }: {
    extra: any;
    uploadId: string;
    validator: ValidateFunction;
    multiSelectColumnHeadings: string[];
    dateFormats: Record<string, string[]>;
  }) {
    let batchCount = 1;
    const batches: IBatchItem[] = [];
    const batchRecords: IDataItem[] = [];
    if (!this._modal) {
      console.log(`Modal not found for upload ${uploadId}`, this._modal);
      this._modal = this.dalService.getRecordCollection(uploadId);
    }
    const resultObj = {};

    for await (const record of this._modal.find({ updated: { $ne: {}, $exists: true } })) {
      const checkRecord: Record<string, unknown> = multiSelectColumnHeadings.reduce((acc, heading) => {
        if (heading === '_') return acc;

        if (multiSelectColumnHeadings.includes(heading)) {
          acc[heading] = record.record[heading]?.split(',');
        }

        return acc;
      }, record.record);
      const validationResultItem = this.validateRecord({
        validator,
        checkRecord,
        dateFormats,
        index: record.index,
        passRecord: record.record,
      });
      resultObj[Number(record.index)] = record.isValid;
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

    return {
      batches,
      resultObj,
    };
  }

  private async saveResults({ uploadId, validRecords, invalidRecords }: ISaveResults) {
    await this.uploadRepository.update(
      { _id: uploadId },
      {
        status: UploadStatusEnum.REVIEWING,
        validRecords,
        invalidRecords,
      }
    );
  }
}
