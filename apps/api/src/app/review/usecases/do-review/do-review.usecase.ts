import { Model } from 'mongoose';
import { Writable } from 'stream';
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';

import { APIMessages } from '@shared/constants';
import { EMAIL_SUBJECT } from '@impler/shared';
import { BaseReview } from './base-review.usecase';
import { UniqueWithValidationType, ValidationTypesEnum } from '@impler/client';
import { BATCH_LIMIT } from '@shared/services/sandbox';
import { StorageService, PaymentAPIService, EmailService } from '@impler/services';
import { ColumnTypesEnum, UploadStatusEnum, ITemplateSchemaItem, ColumnDelimiterEnum } from '@impler/shared';
import {
  UploadRepository,
  ValidatorRepository,
  FileRepository,
  DalService,
  TemplateEntity,
  TemplateRepository,
  RecordEntity,
} from '@impler/dal';

interface ISaveResults {
  uploadId: string;
  _templateId: string;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
}

@Injectable()
export class DoReview extends BaseReview {
  private _modal: Model<RecordEntity>;

  constructor(
    private templateRepository: TemplateRepository,
    private storageService: StorageService,
    private uploadRepository: UploadRepository,
    private validatorRepository: ValidatorRepository,
    private fileRepository: FileRepository,
    private dalService: DalService,
    private emailService: EmailService,
    private paymentAPIService: PaymentAPIService
  ) {
    super();
  }

  async execute(_uploadId: string) {
    this._modal = this.dalService.getRecordCollection(_uploadId);
    const userEmail = await this.uploadRepository.getUserEmailFromUploadId(_uploadId);

    const uploadInfo = await this.uploadRepository.getUploadWithTemplate(_uploadId, ['name']);
    if (!uploadInfo) {
      throw new BadRequestException(APIMessages.UPLOAD_NOT_FOUND);
    }
    const dateFormats: Record<string, string[]> = {};
    const uniqueItems: Record<string, Set<any>> = {};
    const columns = JSON.parse(uploadInfo.customSchema);
    const multiSelectColumnHeadings: Record<string, string> = {};
    const numberColumnHeadings = new Set<string>();
    const validationErrorMessages = {};
    const uniqueColumnKeysCombinationMap = new Map<string, Set<string>>();
    (columns as ITemplateSchemaItem[]).forEach((column) => {
      if (column.type === ColumnTypesEnum.SELECT && column.allowMultiSelect)
        multiSelectColumnHeadings[column.key] = column.delimiter || ColumnDelimiterEnum.COMMA;
      if (column.type === ColumnTypesEnum.NUMBER || column.type === ColumnTypesEnum.DOUBLE)
        numberColumnHeadings.add(column.key);
      if (Array.isArray(column.validations) && column.validations.length > 0) {
        validationErrorMessages[column.key] = {};
        column.validations.forEach((validation) => {
          validationErrorMessages[column.key][validation.validate] = validation.errorMessage;
          if (validation.validate === ValidationTypesEnum.UNIQUE_WITH) {
            if (uniqueColumnKeysCombinationMap.has((validation as UniqueWithValidationType).uniqueKey)) {
              uniqueColumnKeysCombinationMap.set(
                (validation as UniqueWithValidationType).uniqueKey,
                new Set([
                  ...uniqueColumnKeysCombinationMap.get((validation as UniqueWithValidationType).uniqueKey),
                  column.key,
                ])
              );
            } else {
              uniqueColumnKeysCombinationMap.set(
                (validation as UniqueWithValidationType).uniqueKey,
                new Set([column.key])
              );
            }
          }
        });
      }
    });
    const schema = this.buildAJVSchema({
      columns,
      dateFormats,
      uniqueItems,
    });

    const uniqueCombinations = {};
    uniqueColumnKeysCombinationMap.forEach((value, key) => {
      if (value.size > 1) {
        uniqueCombinations[this.getUniqueKey(key)] = Array.from(value);
        schema[this.getUniqueKey(key)] = true;
      }
    });
    const ajv = this.getAjvValidator(dateFormats, uniqueItems, uniqueCombinations);
    const validator = ajv.compile(schema);

    const uploadedFileInfo = await this.fileRepository.findById(uploadInfo._uploadedFileId, 'path');
    const validations = await this.validatorRepository.findOne(
      { _templateId: (uploadInfo._templateId as unknown as TemplateEntity)._id },
      'onBatchInitialize'
    );

    const response: ISaveResults = {
      _templateId: (uploadInfo._templateId as unknown as TemplateEntity)._id,
      uploadId: _uploadId,
      totalRecords: 0,
      validRecords: 0,
      invalidRecords: 0,
    };

    const csvFileStream = await this.storageService.getFileStream(uploadedFileInfo.path);
    const { dataStream } = this.getStreams({
      recordsModal: this._modal,
    });
    const errorEmailContents: {
      subject: string;
      content: string;
    }[] = [];

    if (validations && validations.onBatchInitialize) {
      const batches = await this.batchRun({
        uploadId: _uploadId,
        csvFileStream,
        headings: uploadInfo.headings,
        validator,
        extra: uploadInfo.extra,
        dataStream, // not-used
        dateFormats,
        uniqueCombinations,
        numberColumnHeadings,
        multiSelectColumnHeadings,
        validationErrorMessages,
        headerRow: uploadInfo.headerRow,
      });

      await this.processBatches({
        batches,
        onBatchInitialize: validations.onBatchInitialize,
        uploadId: _uploadId,
        dataStream,
        forItem: (item: any) => {
          response.totalRecords++;
          if (item.isValid) {
            response.validRecords++;
          } else {
            response.invalidRecords++;
          }
        },
        onError: async (error) => {
          const emailContent = this.emailService.getEmailContent({
            type: 'ERROR_EXECUTING_CODE',
            data: {
              error: JSON.stringify(error.output, null, 2).replace(/\\+"/g, '"'),
              importId: _uploadId,
              importName: (uploadInfo._templateId as unknown as TemplateEntity).name,
              time: new Date().toString(),
            },
          });
          errorEmailContents.push({
            subject: `${EMAIL_SUBJECT.ERROR_EXECUTING_VALIDATION_CODE} ${
              (uploadInfo._templateId as unknown as TemplateEntity).name
            }`,
            content: emailContent,
          });
        },
      });
    } else {
      const { invalidRecords, totalRecords, uploadId, validRecords } = await this.normalRun({
        csvFileStream,
        dataStream,
        extra: uploadInfo.extra,
        headings: uploadInfo.headings,
        uploadId: _uploadId,
        validator,
        dateFormats,
        uniqueCombinations,
        numberColumnHeadings,
        validationErrorMessages,
        multiSelectColumnHeadings,
        headerRow: uploadInfo.headerRow,
      });
      response.invalidRecords = invalidRecords;
      response.totalRecords = totalRecords;
      response.uploadId = uploadId;
      response.validRecords = validRecords;
    }
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

    await this.saveResults(response);

    return response;
  }

  getStreams({ recordsModal }: { recordsModal: Model<any> }) {
    const dataRecords = [];
    const dataStream = new Writable({
      objectMode: true,
      async write(chunk, encoding, callback) {
        dataRecords.push(chunk);
        if (dataRecords.length === BATCH_LIMIT) {
          await recordsModal.insertMany(dataRecords);
          dataRecords.length = 0;
        }
        callback();
      },
      async final(callback) {
        await recordsModal.insertMany(dataRecords);
        dataRecords.length = 0;
        callback();
      },
    });

    return {
      dataStream,
    };
  }

  private async saveResults({ uploadId, totalRecords, validRecords, invalidRecords, _templateId }: ISaveResults) {
    await this.uploadRepository.update(
      { _id: uploadId },
      {
        status: UploadStatusEnum.REVIEWING,
        totalRecords,
        validRecords,
        invalidRecords,
      }
    );
    await this.templateRepository.findOneAndUpdate(
      {
        _id: _templateId,
      },
      {
        $inc: {
          totalUploads: 1,
          totalRecords: totalRecords,
          totalInvalidRecords: invalidRecords,
        },
      }
    );
    const userExternalIdOrEmail = await this.uploadRepository.getUserEmailFromUploadId(uploadId);

    await this.paymentAPIService.createEvent(
      { uploadId, totalRecords, validRecords, invalidRecords },
      userExternalIdOrEmail
    );
  }
}
