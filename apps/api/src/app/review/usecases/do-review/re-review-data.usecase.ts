import { Model } from 'mongoose';
import { Writable } from 'stream';
import { ValidateFunction } from 'ajv';
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';

import { ValidationTypesEnum } from '@impler/client';
import { UploadRepository, ValidatorRepository, DalService, TemplateEntity } from '@impler/dal';
import {
  EMAIL_SUBJECT,
  ColumnTypesEnum,
  UploadStatusEnum,
  ColumnDelimiterEnum,
  ITemplateSchemaItem,
} from '@impler/shared';

import { APIMessages } from '@shared/constants';
import { EmailService } from '@impler/services';
import { BATCH_LIMIT } from '@shared/services/sandbox';
import { BaseReview } from './base-review.usecase';
import { ValidationErrorMessages } from '@shared/types/review.types';

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
    private emailService: EmailService,
    private uploadRepository: UploadRepository,
    private validatorRepository: ValidatorRepository
  ) {
    super();
  }

  async execute(_uploadId: string) {
    this._modal = this.dalService.getRecordCollection(_uploadId);

    const uploadInfo = await this.uploadRepository.getUploadWithTemplate(_uploadId, ['name']);
    if (!uploadInfo) {
      throw new BadRequestException(APIMessages.UPLOAD_NOT_FOUND);
    }
    const userEmail = await this.uploadRepository.getUserEmailFromUploadId(_uploadId);
    const dateFormats: Record<string, string[]> = {};
    const uniqueItems: Record<string, Set<any>> = {};
    const uniqueColumnKeysCombinationMap = new Map<string, Set<string>>();
    const validations = await this.validatorRepository.findOne({
      _templateId: (uploadInfo._templateId as unknown as TemplateEntity)._id,
    });

    const columns = JSON.parse(uploadInfo.customSchema) as ITemplateSchemaItem[];
    const uniqueFieldsSet = new Set(columns.filter((column) => column.isUnique).map((column) => column.key));
    const multiSelectColumnHeadings: Record<string, string> = {};
    const validationErrorMessages = {};
    (columns as ITemplateSchemaItem[]).forEach((column) => {
      if (column.type === ColumnTypesEnum.SELECT && column.allowMultiSelect)
        multiSelectColumnHeadings[column.key] = column.delimiter || ColumnDelimiterEnum.COMMA;
      if (Array.isArray(column.validations) && column.validations.length > 0) {
        validationErrorMessages[column.key] = {};
        column.validations.forEach((validatorItem) => {
          validationErrorMessages[column.key][validatorItem.validate] = validatorItem.errorMessage;
          if (validatorItem.validate === ValidationTypesEnum.UNIQUE_WITH) {
            if (uniqueColumnKeysCombinationMap.has(validatorItem.uniqueKey)) {
              uniqueColumnKeysCombinationMap.set(
                validatorItem.uniqueKey,
                new Set([...uniqueColumnKeysCombinationMap.get(validatorItem.uniqueKey), column.key])
              );
            } else {
              uniqueColumnKeysCombinationMap.set(validatorItem.uniqueKey, new Set([column.key]));
            }
            uniqueFieldsSet.add(column.key);
          }
        });
      }
    });
    const uniqueFields = [...uniqueFieldsSet];
    const uniqueFieldData = uniqueFields.length ? await this.dalService.getFieldData(_uploadId, uniqueFields) : [];

    const uniqueCombinations = {};
    const schema = this.buildAJVSchema({
      columns: JSON.parse(uploadInfo.customSchema),
      dateFormats,
      uniqueItems,
    });
    uniqueColumnKeysCombinationMap.forEach((value, key) => {
      if (value.size > 1) {
        uniqueCombinations[this.getUniqueKey(key)] = Array.from(value);
        schema[this.getUniqueKey(key)] = true;
      }
    });
    const ajv = this.getAjvValidator(dateFormats, uniqueItems, uniqueCombinations);
    const validator = ajv.compile(schema);

    uniqueFieldData.forEach((item) => {
      uniqueFields.forEach((field) => {
        if (!uniqueItems[field]) uniqueItems[field] = new Set();
        uniqueItems[field].add(item.record[field]);
      });
    });
    const bulkOperations = [];
    for (const key of Object.keys(uniqueItems)) {
      const itemsArray = Array.from(uniqueItems[key]);
      // Iterate over each value in unique field
      for (const item of itemsArray) {
        // update first occurance of data
        bulkOperations.push({
          updateOne: {
            filter: { [`record.${key}`]: item },
            update: { $set: { [`updated.${key}`]: true } },
          },
        });
        // update second occurance of data for validity
        bulkOperations.push({
          updateOne: {
            filter: {
              [`record.${key}`]: item,
              $or: [{ [`updated.${key}`]: false }, { [`updated.${key}`]: { $exists: false } }],
            },
            update: { $set: { [`updated.${key}`]: true } },
          },
        });
      }
      uniqueItems[key].clear();
    }
    await this._modal.bulkWrite(bulkOperations, {
      ordered: false,
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
        userEmail,
        dateFormats,
        uniqueCombinations,
        uploadId: _uploadId,
        validationErrorMessages,
        extra: uploadInfo.extra,
        multiSelectColumnHeadings,
        onBatchInitialize: validations.onBatchInitialize,
        name: (uploadInfo._templateId as unknown as TemplateEntity).name,
      });
    } else {
      result = await this.normalValidate({
        uploadId: _uploadId,
        validator,
        dateFormats,
        result,
        uniqueCombinations,
        multiSelectColumnHeadings,
        validationErrorMessages,
      });
    }

    await this.saveResults(result);

    return result;
  }
  formatRecord({
    record,
    multiSelectColumnHeadings,
  }: {
    headings?: string[];
    record: Record<string, any>;
    numberColumnHeadings?: Set<string>;
    multiSelectColumnHeadings?: Record<string, string>;
  }) {
    return Object.keys(multiSelectColumnHeadings).reduce(
      (acc, heading) => {
        if (typeof record.record[heading] === 'string') {
          acc[heading] = record.record[heading]?.split(multiSelectColumnHeadings[heading]);
        }

        return acc;
      },
      { ...record.record }
    );
  }
  private async normalValidate({
    result,
    uploadId,
    validator,
    dateFormats,
    uniqueCombinations,
    validationErrorMessages,
    multiSelectColumnHeadings,
  }: {
    uploadId: string;
    result: ISaveResults;
    validator: ValidateFunction;
    dateFormats: Record<string, string[]>;
    uniqueCombinations: Record<string, string[]>;
    validationErrorMessages: ValidationErrorMessages;
    multiSelectColumnHeadings: Record<string, string>;
  }) {
    const bulkOp = [];
    const response: ISaveResults = {
      uploadId,
      totalRecords: 0,
      validRecords: result.validRecords,
      invalidRecords: result.invalidRecords,
    };

    for await (const record of this._modal.find({ updated: { $ne: {}, $exists: true } })) {
      const checkRecord: Record<string, unknown> = this.formatRecord({ record, multiSelectColumnHeadings });
      const validationResult = this.validateRecord({
        validator,
        checkRecord,
        dateFormats,
        uniqueCombinations,
        index: record.index,
        validationErrorMessages,
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
      bulkOp.push({ updateOne: { filter: { index: record.index }, update: { $set: validationResult } } });
    }
    if (response.totalRecords > 0) {
      await this._modal.bulkWrite(bulkOp, {
        ordered: false,
      });
    }

    return response;
  }

  getStreams() {
    const bulkOp = [];
    const dataStream = new Writable({
      objectMode: true,
      async write(record, encoding, callback) {
        bulkOp.push({
          updateOne: {
            filter: { index: record.index },
            update: {
              $set: {
                errors: record.errors,
                isValid: record.isValid,
                updated: {},
              },
            },
          },
        });
        callback();
      },
      final: async (callback) => {
        try {
          await this._modal.bulkWrite(bulkOp, {
            ordered: false,
          });
        } catch (error) {}
        callback();
      },
    });

    return {
      dataStream,
    };
  }

  private async batchValidate({
    name,
    extra,
    result,
    uploadId,
    validator,
    userEmail,
    dateFormats,
    onBatchInitialize,
    uniqueCombinations,
    validationErrorMessages,
    multiSelectColumnHeadings,
  }: {
    extra: any;
    name: string;
    uploadId: string;
    userEmail: string;
    result: ISaveResults;
    onBatchInitialize: string;
    validator: ValidateFunction;
    dateFormats: Record<string, string[]>;
    uniqueCombinations: Record<string, string[]>;
    validationErrorMessages: ValidationErrorMessages;
    multiSelectColumnHeadings: Record<string, string>;
  }) {
    const { dataStream } = this.getStreams();
    const { batches } = await this.prepareBatches({
      extra,
      result,
      uploadId,
      validator,
      dateFormats,
      uniqueCombinations,
      validationErrorMessages,
      multiSelectColumnHeadings,
    });
    const errorEmailContents: {
      subject: string;
      content: string;
    }[] = [];

    await this.processBatches({
      batches,
      uploadId,
      dataStream,
      onBatchInitialize,
      forItem(item) {
        if (!item.isValid) {
          result.invalidRecords++;
        } else if (item.isValid) {
          result.validRecords++;
        }
      },
      onError: async (error) => {
        const emailContent = this.emailService.getEmailContent({
          type: 'ERROR_EXECUTING_CODE',
          data: {
            error: JSON.stringify(error.output, null, 2).replace(/\\+"/g, '"'),
            importId: uploadId,
            importName: name,
            time: new Date().toString(),
          },
        });
        errorEmailContents.push({
          subject: `${EMAIL_SUBJECT.ERROR_EXECUTING_VALIDATION_CODE} ${name}`,
          content: emailContent,
        });
      },
    });

    for (const errorEmailContent of errorEmailContents) {
      await this.emailService.sendEmail({
        from: process.env.ALERT_EMAIL_FROM,
        html: errorEmailContent.content,
        subject: errorEmailContent.subject,
        to: userEmail,
        senderName: process.env.EMAIL_FROM_NAME,
      });
    }

    if (errorEmailContents.length) {
      throw new InternalServerErrorException(APIMessages.ERROR_DURING_VALIDATION);
    }

    return result;
  }

  private async prepareBatches({
    extra,
    result,
    uploadId,
    validator,
    dateFormats,
    uniqueCombinations,
    validationErrorMessages,
    multiSelectColumnHeadings,
  }: {
    extra: any;
    uploadId: string;
    result: ISaveResults;
    validator: ValidateFunction;
    dateFormats: Record<string, string[]>;
    uniqueCombinations: Record<string, string[]>;
    validationErrorMessages: ValidationErrorMessages;
    multiSelectColumnHeadings: Record<string, string>;
  }) {
    let batchCount = 1;
    const batches: IBatchItem[] = [];
    const batchRecords: IDataItem[] = [];
    if (!this._modal) {
      console.log(`Modal not found for upload ${uploadId}`, this._modal);
      this._modal = this.dalService.getRecordCollection(uploadId);
    }

    for await (const record of this._modal.find({ updated: { $ne: {}, $exists: true } })) {
      if (record.isValid) result.validRecords--;
      else result.invalidRecords--;
      const checkRecord: Record<string, unknown> = this.formatRecord({ record, multiSelectColumnHeadings });
      const validationResultItem = this.validateRecord({
        validator,
        checkRecord,
        dateFormats,
        uniqueCombinations,
        index: record.index,
        validationErrorMessages,
        passRecord: record.record,
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

    return {
      batches,
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
