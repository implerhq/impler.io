import { Response } from 'express';
import * as Papa from 'papaparse';
import { Readable } from 'stream';
import addFormats from 'ajv-formats';
import addKeywords from 'ajv-keywords';
import Ajv, { ErrorObject } from 'ajv';
import { FileNameService } from '@shared/services';

import { ColumnTypesEnum, FileEncodingsEnum, FileMimeTypesEnum, UploadStatusEnum } from '@impler/shared';
import { Injectable, BadRequestException } from '@nestjs/common';
import {
  ColumnEntity,
  MappingEntity,
  FileRepository,
  ColumnRepository,
  UploadRepository,
  MappingRepository,
} from '@impler/dal';
import { APIMessages } from '@shared/constants';
import { StorageService } from '@impler/shared/dist/services/storage';
import { FileNotExistError } from '@shared/errors/file-not-exist.error';

const ajv = new Ajv({
  allErrors: true,
  coerceTypes: true,
  allowUnionTypes: true,
  removeAdditional: true,
  verbose: true,
});
addFormats(ajv, ['email']);
addKeywords(ajv);
ajv.addFormat('custom-date-time', function (dateTimeString) {
  if (typeof dateTimeString === 'object') {
    dateTimeString = (dateTimeString as Date).toISOString();
  }

  return !isNaN(Date.parse(dateTimeString)); // any test that returns true/false
});

// Empty keyword
ajv.addKeyword({
  keyword: 'emptyCheck',
  schema: false,
  compile: () => {
    return (data) => (data === undefined || data === null || data === '' ? false : true);
  },
});

@Injectable()
export class DoReview {
  constructor(
    private uploadRepository: UploadRepository,
    private storageService: StorageService,
    private columnRepository: ColumnRepository,
    private mappingRepository: MappingRepository,
    private fileRepository: FileRepository,
    private fileNameService: FileNameService
  ) {}

  async execute(uploadId: string, res: Response, limit: number) {
    const uploadInfo = await this.uploadRepository.getUploadInformation(uploadId);
    if (!uploadInfo) {
      throw new BadRequestException(APIMessages.UPLOAD_NOT_FOUND);
    }
    if (uploadInfo.status !== UploadStatusEnum.MAPPED) {
      throw new BadRequestException(APIMessages.FILE_MAPPING_REMAINING);
    }
    const fileInfo = await this.fileRepository.findById(uploadInfo._uploadedFileId);
    const fileStream = await this.storageService.getFileStream(fileInfo.path);

    const mappings = await this.mappingRepository.find({ _uploadId: uploadId }, '_columnId columnHeading');
    const columns = await this.columnRepository.find(
      { _templateId: uploadInfo._templateId },
      'isRequired isUnique selectValues type regex'
    );
    const schema = this.buildAJVSchema(columns, mappings);
    const validator = ajv.compile(schema);

    const validFilePath = this.fileNameService.getValidDataFilePath(uploadId);
    const invalidFilePath = this.fileNameService.getInvalidDataFilePath(uploadId);
    const invalidCsvDataFilePath = this.fileNameService.getInvalidCSVDataFilePath(uploadId);
    const validDataStream = new Readable({
      read() {},
    });
    const invalidDataStream = new Readable({
      read() {},
    });
    const invalidCsvDataStream = new Readable({
      read() {},
    });
    this.storageService.writeStream(validFilePath, validDataStream, FileMimeTypesEnum.JSON);
    this.storageService.writeStream(invalidFilePath, invalidDataStream, FileMimeTypesEnum.JSON);
    this.storageService.writeStream(invalidCsvDataFilePath, invalidCsvDataStream, FileMimeTypesEnum.CSV);
    invalidCsvDataStream.push(['index', 'message', ...uploadInfo.headings].join(',') + '\n');
    res.write('\n');

    let validRecords = 0,
      invalidRecords = 0,
      totalRecords = 0;

    Papa.parse(fileStream, {
      dynamicTyping: false,
      skipEmptyLines: true,
      step: (results: Papa.ParseStepResult<any>) => {
        const record = results.data;
        const recordObj = uploadInfo.headings.reduce((acc, heading, index) => {
          acc[heading] = record[index];

          return acc;
        }, {});
        totalRecords++;

        if (totalRecords > 1) {
          const isValid = validator(recordObj);
          if (!isValid) {
            const message = this.getErrors(validator.errors);
            const invalidItem = {
              index: totalRecords,
              message,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              ...recordObj,
            };
            if (totalRecords <= limit) res.write('data:' + JSON.stringify(invalidItem) + '\n\n');
            invalidDataStream.push((invalidRecords === 0 ? '[' : ',') + JSON.stringify(invalidItem));
            invalidCsvDataStream.push([totalRecords, message, ...record].join(',') + '\n');
            invalidRecords++;
          } else {
            validDataStream.push((validRecords === 0 ? '[' : ',') + JSON.stringify(recordObj));
            validRecords++;
          }
        }
      },
      complete: () => {
        validDataStream.push(']');
        invalidDataStream.push(']');
        validDataStream.push(null);
        invalidDataStream.push(null);
        invalidCsvDataStream.push(null);
        this.saveFileContents({
          uploadId,
          invalidRecords,
          totalRecords,
          validRecords,
        });
        res.write(
          'data: ' +
            JSON.stringify({
              limit,
              page: 1,
              totalPages: Math.ceil(invalidRecords / limit),
              totalRecords,
              invalidRecords,
              invalidCsvDataFilePath,
            }) +
            '\n\n'
        );
        res.end();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  async getFileContent(path): Promise<string> {
    try {
      const dataContent = await this.storageService.getFileContent(path, FileEncodingsEnum.JSON);

      return JSON.parse(dataContent);
    } catch (error) {
      if (error instanceof FileNotExistError) {
        throw new BadRequestException(APIMessages.FILE_NOT_FOUND_IN_STORAGE);
      }
      throw error;
    }
  }

  private buildAJVSchema(columns: ColumnEntity[], mappings: MappingEntity[]) {
    const formattedColumns: Record<string, ColumnEntity> = columns.reduce((acc, column) => {
      acc[column._id] = { ...column };

      return acc;
    }, {});
    const properties: Record<string, unknown> = mappings.reduce((acc, mapping) => {
      acc[mapping.columnHeading] = this.getProperty(formattedColumns[mapping._columnId]);

      return acc;
    }, {});
    const requiredProperties: string[] = mappings.reduce((acc, mapping) => {
      if (formattedColumns[mapping._columnId].isRequired) acc.push(mapping.columnHeading);

      return acc;
    }, []);

    return {
      type: 'object',
      properties,
      required: requiredProperties,
      additionalProperties: false,
    };
  }

  private getProperty(column: ColumnEntity): Record<string, unknown> {
    let property: Record<string, unknown> = {};

    switch (column.type) {
      case ColumnTypesEnum.STRING:
        property = {
          type: 'string',
        };
        break;
      case ColumnTypesEnum.NUMBER:
        property = {
          type: 'number',
        };
        break;
      case ColumnTypesEnum.SELECT:
        property = {
          type: 'string',
          enum: column.selectValues || [],
        };
        break;
      case ColumnTypesEnum.REGEX:
        const [full, pattern, flags] = column.regex.match(/\/(.*)\/(.*)|(.*)/);

        property = { type: 'string', regexp: { pattern: pattern || full, flags: flags || '' } };
        break;
      case ColumnTypesEnum.EMAIL:
        property = { type: 'string', format: 'email' };
        break;
      case ColumnTypesEnum.DATE:
        property = { type: 'string', format: 'custom-date-time' };
        break;
      case ColumnTypesEnum.ANY:
        property = { type: ['string', 'number', 'object'] };
        break;
    }

    return {
      ...property,
      ...(column.isUnique && { uniqueCheck: true }),
      ...(column.isRequired && { emptyCheck: true }),
    };
  }

  private getErrors(errors: ErrorObject[]) {
    let field: string;

    return errors.reduce((message, error) => {
      [, field] = error.instancePath.split('/');

      // eslint-disable-next-line no-magic-numbers
      return (message += this.getMessage(error, field || error.schema[0]));
    }, '');
  }

  private getMessage(error: ErrorObject, field: string): string {
    let message = '';
    switch (true) {
      // empty string case
      case error.keyword === 'emptyCheck':
        message = ` must not be empty`;
        break;
      // uniqueCheck
      case error.keyword === 'uniqueCheck':
        message = ` must be unique`;
        break;
      // custom date format
      case error.keyword === 'format' && error.params.format === 'custom-date-time':
        message = ` must be a valid date`;
        break;
      // common cases
      case error.keyword === 'type':
        message = ' ' + error.message;
        break;
      case error.keyword === 'enum':
        message = ` must be from [${error.params.allowedValues}]`;
        break;
      case error.keyword === 'regexp':
        message = ` must match the pattern ${new RegExp(
          error.parentSchema?.regexp?.pattern,
          error.parentSchema?.regexp?.flags || ''
        ).toString()}`;
        break;
      case error.keyword === 'pattern':
        message = ` must match the pattern ${error.params.pattern}`;
        break;
      case error.keyword === 'format':
        message = ` must be a valid ${error.params.format}`;
        break;
      case error.keyword === 'required':
        message = ` is required`;
        break;
      case error.keyword === 'uniqueItemProperties':
        message = ` must be unique`;
        break;
      default:
        message = ` contains invalid data`;
        break;
    }

    return '`' + field + '`' + message;
  }

  private async saveFileContents({
    uploadId,
    totalRecords,
    validRecords,
    invalidRecords,
  }: {
    uploadId: string;
    totalRecords: number;
    validRecords: number;
    invalidRecords: number;
  }) {
    const validDataFileName = this.fileNameService.getValidDataFileName();
    const invalidDataFileName = this.fileNameService.getInvalidDataFileName();
    const invalidCsvFileName = this.fileNameService.getInvalidCSVDataFileName();

    const validDataFilePath = this.fileNameService.getValidDataFilePath(uploadId);
    const invalidDataFilePath = this.fileNameService.getInvalidDataFilePath(uploadId);
    const invalidCsvFilePath = this.fileNameService.getInvalidCSVDataFilePath(uploadId);
    const invalidCSVDataFileUrl = this.fileNameService.getInvalidCSVDataFileUrl(uploadId);

    const validDataFile = await this.makeFileEntry(validDataFileName, validDataFilePath);
    const invalidDataFile = await this.makeFileEntry(invalidDataFileName, invalidDataFilePath);
    const invalidCsvFile = await this.makeFileEntry(invalidCsvFileName, invalidCsvFilePath);

    await this.uploadRepository.update(
      { _id: uploadId },
      {
        status: UploadStatusEnum.REVIEWING,
        _validDataFileId: validDataFile._id,
        _invalidDataFileId: invalidDataFile._id,
        _invalidCSVDataFileId: invalidCsvFile._id,
        invalidCSVDataFileUrl,
        totalRecords,
        validRecords,
        invalidRecords,
      }
    );
  }

  private async makeFileEntry(fileName: string, filePath: string) {
    return await this.fileRepository.create({
      mimeType: FileMimeTypesEnum.JSON,
      name: fileName,
      originalName: fileName,
      path: filePath,
    });
  }
}
