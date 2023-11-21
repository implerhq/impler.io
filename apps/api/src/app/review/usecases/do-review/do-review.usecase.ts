import * as dayjs from 'dayjs';
import { Model } from 'mongoose';
import { Writable } from 'stream';
import addFormats from 'ajv-formats';
import addKeywords from 'ajv-keywords';
import Ajv, { AnySchemaObject } from 'ajv';
import { Injectable, BadRequestException } from '@nestjs/common';

import { APIMessages } from '@shared/constants';
import { UploadStatusEnum } from '@impler/shared';
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
export class DoReview extends BaseReview {
  private _modal: Model<any>;

  constructor(
    private storageService: StorageService,
    private uploadRepository: UploadRepository,
    private validatorRepository: ValidatorRepository,
    private fileRepository: FileRepository,
    private dalService: DalService
  ) {
    super(dateFormats);
  }

  async execute(_uploadId: string) {
    this._modal = await this.dalService.createRecordCollection(_uploadId);

    const uploadInfo = await this.uploadRepository.findById(_uploadId);
    if (!uploadInfo) {
      throw new BadRequestException(APIMessages.UPLOAD_NOT_FOUND);
    }
    const schema = this.buildAJVSchema(JSON.parse(uploadInfo.customSchema), uniqueItems);
    const validator = ajv.compile(schema);

    const uploadedFileInfo = await this.fileRepository.findById(uploadInfo._uploadedFileId);
    const validations = await this.validatorRepository.findOne({ _templateId: uploadInfo._templateId });

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
      });

      response = await this.processBatches({
        batches,
        onBatchInitialize: validations.onBatchInitialize,
        uploadId: _uploadId,
        dataStream,
      });
    } else {
      response = await this.normalRun({
        csvFileStream,
        dataStream,
        extra: uploadInfo.extra,
        headings: uploadInfo.headings,
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
