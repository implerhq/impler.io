import { Model } from 'mongoose';
import { Writable } from 'stream';
import { Injectable, BadRequestException } from '@nestjs/common';

import { APIMessages } from '@shared/constants';
import { ColumnTypesEnum, ITemplateSchemaItem, UploadStatusEnum } from '@impler/shared';
import { BaseReview } from './base-review.usecase';
import { BATCH_LIMIT } from '@shared/services/sandbox';
import { StorageService } from '@impler/shared/dist/services/storage';
import { UploadRepository, ValidatorRepository, FileRepository, DalService } from '@impler/dal';

interface ISaveResults {
  uploadId: string;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
}

@Injectable()
export class DoReview extends BaseReview {
  private _modal: Model<any>;

  constructor(
    private storageService: StorageService,
    private uploadRepository: UploadRepository,
    private validatorRepository: ValidatorRepository,
    private fileRepository: FileRepository,
    private dalService: DalService
  ) {
    super();
  }

  async execute(_uploadId: string) {
    this._modal = await this.dalService.createRecordCollection(_uploadId);

    const uploadInfo = await this.uploadRepository.findById(
      _uploadId,
      'customSchema _uploadedFileId _templateId extra headings'
    );
    if (!uploadInfo) {
      throw new BadRequestException(APIMessages.UPLOAD_NOT_FOUND);
    }
    const dateFormats: Record<string, string[]> = {};
    const uniqueItems: Record<string, Set<any>> = {};
    const columns = JSON.parse(uploadInfo.customSchema);
    const multiSelectColumnHeadings = new Set<string>();
    const numberColumnHeadings = new Set<string>();
    (columns as ITemplateSchemaItem[]).forEach((column) => {
      if (column.type === ColumnTypesEnum.SELECT && column.allowMultiSelect) multiSelectColumnHeadings.add(column.key);
      if (column.type === ColumnTypesEnum.NUMBER) numberColumnHeadings.add(column.key);
    });
    const schema = this.buildAJVSchema({
      columns,
      dateFormats,
      uniqueItems,
    });
    const ajv = this.getAjvValidator(dateFormats, uniqueItems);
    const validator = ajv.compile(schema);

    const uploadedFileInfo = await this.fileRepository.findById(uploadInfo._uploadedFileId, 'path');
    const validations = await this.validatorRepository.findOne(
      { _templateId: uploadInfo._templateId },
      'onBatchInitialize'
    );

    let response: ISaveResults;

    const csvFileStream = await this.storageService.getFileStream(uploadedFileInfo.path);
    const { dataStream } = this.getStreams({
      recordsModal: this._modal,
    });

    if (validations && validations.onBatchInitialize) {
      const batches = await this.batchRun({
        uploadId: _uploadId,
        csvFileStream,
        headings: uploadInfo.headings,
        validator,
        extra: uploadInfo.extra,
        dataStream, // not-used
        dateFormats,
        numberColumnHeadings,
        multiSelectColumnHeadings,
      });

      response = {
        uploadId: _uploadId,
        totalRecords: 0,
        validRecords: 0,
        invalidRecords: 0,
      };

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
      });
    } else {
      response = await this.normalRun({
        csvFileStream,
        dataStream,
        extra: uploadInfo.extra,
        headings: uploadInfo.headings,
        uploadId: _uploadId,
        validator,
        dateFormats,
        numberColumnHeadings,
        multiSelectColumnHeadings,
      });
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
