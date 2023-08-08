import * as fs from 'fs';
import { Readable } from 'stream';
import * as Papa from 'papaparse';
import addFormats from 'ajv-formats';
import addKeywords from 'ajv-keywords';
import { Injectable, BadRequestException } from '@nestjs/common';
import Ajv, { AnySchemaObject, ErrorObject, ValidateFunction } from 'ajv';

import {
  ColumnRepository,
  UploadRepository,
  MappingRepository,
  ColumnEntity,
  ValidatorRepository,
  FileRepository,
} from '@impler/dal';
import { StorageService } from '@impler/shared/dist/services/storage';
import { ColumnTypesEnum, FileMimeTypesEnum, UploadStatusEnum } from '@impler/shared';

import { APIMessages } from '@shared/constants';
import { FileNameService } from '@shared/services';
import { SManager } from 'app/review/service/Sandbox';

interface IDataItem {
  index: number;
  errors?: Record<string, string>;
  isValid: boolean;
  record: Record<string, any>;
}
interface IBatchItem {
  uploadId: string;
  data: IDataItem[];
  batchCount: number;
  extra: any;
  // totalRecords: number;
}

const batchLimit = 500;
const mainCode = `
const fs = require('fs');
const { code } = require('./code');
let input = fs.readFileSync('./input.json', 'utf8');

const startTime = Date.now();
input = JSON.parse(input);

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function saveCodeOutput(output) {
  fs.writeFileSync('./code-output.json', JSON.stringify(output));
}

function saveOutput(output, startTime) {
  fs.writeFileSync('./output.json', JSON.stringify({
    output,
    status: "OK"
  }));
  fs.writeFileSync('./meta.txt', 'time: ' + ((Date.now() - startTime) / 1000));
}

function saveError(error, startTime) {
  console.error(error);
  fs.writeFileSync('./meta.txt', 'time: ' + ((Date.now() - startTime) / 1000));
  fs.writeFileSync('./output.json', JSON.stringify({
    status: "ERROR",
    output: error.message
  }))
}

function isObjectEmpty(obj) {
  for(let i in obj) return false; 
  return true;
}

function processErrors(batchData, errors) {
  if(!Array.isArray(errors) || (Array.isArray(errors) && errors.length === 0)) {
    return batchData;
  }
  let rowIndexToUpdate, combinedErrors, isErrorsEmpty;
  errors.forEach(error => {
    rowIndexToUpdate = error.index - Math.max(0, ((batchData.batchCount - 1)* input.chunkSize));
    rowIndexToUpdate -= 1;
    if(
      rowIndexToUpdate <= batchData.batchCount * input.chunkSize && 
      (typeof error.errors === 'object' && !Array.isArray(error.errors) && error.errors !== null)
    ) {
      combinedErrors = Object.assign(batchData.data[rowIndexToUpdate]?.errors || {}, error.errors);
      isErrorsEmpty = isObjectEmpty(combinedErrors);
      batchData.data[rowIndexToUpdate] = {
        ...batchData.data[rowIndexToUpdate],
        errors: combinedErrors,
        isValid: isErrorsEmpty
      }
    }
  });
  return batchData;
}


if (typeof code === 'function') {
  if(code.constructor.name === 'AsyncFunction') {
    code(input).then((outputErrors) => {
      saveCodeOutput(outputErrors);
      let output = processErrors(input, outputErrors);
      saveOutput(output, startTime);
      process.exit(0);
    }).catch((error) => {
      saveError(error, startTime);
    });
  } else {
    try {
      const outputErrors = code(input);
      saveCodeOutput(outputErrors);
      let output = processErrors(input, outputErrors);
      saveOutput(output, startTime);
      process.exit(0);
    } catch (error) {
      saveError(error, startTime);
    }
  }
}
`;

const ajv = new Ajv({
  allErrors: true,
  coerceTypes: true,
  allowUnionTypes: true,
  // removeAdditional: true,
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

const uniqueItems: Record<string, Set<any>> = {};
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
export class DoReview {
  constructor(
    private uploadRepository: UploadRepository,
    private storageService: StorageService,
    private columnRepository: ColumnRepository,
    private mappingRepository: MappingRepository,
    private validatorRepository: ValidatorRepository,
    private fileNameService: FileNameService,
    private fileRepository: FileRepository,
    private sandboxManager: SManager
  ) {}

  async execute(_uploadId: string) {
    const uploadInfo = await this.uploadRepository.getUploadInformation(_uploadId);
    if (!uploadInfo) {
      throw new BadRequestException(APIMessages.UPLOAD_NOT_FOUND);
    }
    const mappings = await this.mappingRepository.getMappingWithColumnInfo(_uploadId);
    const columns = await this.columnRepository.find(
      { _templateId: uploadInfo._templateId },
      'isRequired isUnique selectValues type regex'
    );
    const schema = this.buildAJVSchema(columns, mappings);
    const validator = ajv.compile(schema);

    const uploadedFileInfo = await this.fileRepository.findById(uploadInfo._uploadedFileId);
    const validations = await this.validatorRepository.findOne({ _templateId: uploadInfo._templateId });

    if (validations && validations.onBatchInitialize) {
      const batches = await this.batchRun({
        _uploadId,
        allDataFilePath: uploadedFileInfo.path,
        headings: uploadInfo.headings,
        validator,
        extra: uploadInfo.extra,
      });

      return this.processBatches({
        batches,
        headings: uploadInfo.headings,
        onBatchInitialize: validations.onBatchInitialize,
        uploadId: _uploadId,
      });
    } else {
      return this.normalRun({
        allDataFilePath: uploadedFileInfo.path,
        headings: uploadInfo.headings,
        uploadId: _uploadId,
        validator,
      });
    }
  }

  private buildAJVSchema(columns: ColumnEntity[], mappings: any[]) {
    const formattedColumns: Record<string, ColumnEntity> = columns.reduce((acc, column) => {
      acc[column._id] = { ...column };

      return acc;
    }, {});
    const properties: Record<string, unknown> = mappings.reduce((acc, mapping) => {
      acc[mapping.columnHeading] = this.getProperty(formattedColumns[mapping.column._columnId]);

      return acc;
    }, {});
    const requiredProperties: string[] = mappings.reduce((acc, mapping) => {
      if (formattedColumns[mapping.column._columnId].isRequired) acc.push(mapping.column.key);

      return acc;
    }, []);

    return {
      type: 'object',
      properties,
      required: requiredProperties,
      // additionalProperties: false,
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
          ...(Array.isArray(column.selectValues) &&
            column.selectValues.length > 0 && {
              enum: column.selectValues,
            }),
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

  private getErrorsObject(errors: ErrorObject[]): Record<string, string> {
    let field: string;

    return errors.reduce((obj, error) => {
      [, field] = error.instancePath.split('/');
      obj[field] = this.getMessage(error, field || error.schema[0]);

      return obj;
    }, {});
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

  private async executeBatchInSandbox(batchItem: IBatchItem, sandboxManager: SManager, onBatchInitialize: string) {
    const sandbox = await sandboxManager.obtainSandbox(batchItem.uploadId);
    sandbox.clean();
    const sandboxPath = sandbox.getSandboxFolderPath();

    fs.writeFileSync(
      `${sandboxPath}/input.json`,
      JSON.stringify({
        ...batchItem,
        sandboxPath: sandboxPath,
        chunkSize: batchLimit,
        /*
         * fileName: "asdf",
         * extra: "",
         * totalRecords: "",
         */
      })
    );
    fs.writeFileSync(`${sandboxPath}/code.js`, onBatchInitialize);
    fs.writeFileSync(`${sandboxPath}/main.js`, mainCode);

    const nodeExecutablePath = process.execPath;

    return await sandbox.runCommandLine(`${nodeExecutablePath} main.js`);
  }

  private getStreams({ uploadId, headings }: { uploadId: string; headings: string[] }) {
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
    invalidCsvDataStream.push(`"index","message","${headings.join('","')}\n`);

    invalidDataStream.push(`[`);
    validDataStream.push(`[`);

    return {
      validDataStream,
      invalidDataStream,
      invalidCsvDataStream,
    };
  }

  private async normalRun({
    allDataFilePath,
    validator,
    headings,
    uploadId,
  }: {
    uploadId: string;
    allDataFilePath: string;
    validator: ValidateFunction;
    headings: string[];
  }): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const { validDataStream, invalidCsvDataStream, invalidDataStream } = this.getStreams({
        uploadId,
        headings,
      });
      const csvFileStream = await this.storageService.getFileStream(allDataFilePath);

      let totalRecords = 0,
        invalidRecords = 0,
        validRecords = 0,
        item: any;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Papa.parse(csvFileStream, {
        dynamicTyping: false,
        skipEmptyLines: true,
        step: (results: Papa.ParseStepResult<any>) => {
          totalRecords++;
          const record = results.data;

          if (totalRecords > 1) {
            const recordObj = headings.reduce((acc, heading, index) => {
              acc[heading] = record[index];

              return acc;
            }, {});
            const isValid = validator(recordObj);
            if (!isValid) {
              const errors = this.getErrorsObject(validator.errors);
              const message = Object.values(errors).join(', ');
              item = {
                index: totalRecords,
                errors: errors,
                isValid: false,
                record: recordObj,
              };
              invalidDataStream.push((invalidRecords === 0 ? '' : ',') + JSON.stringify(item));
              invalidCsvDataStream.push(`"${totalRecords}","${message}","${record.join('","')}"\n`);
              invalidRecords++;
            } else {
              item = {
                index: totalRecords,
                isValid: true,
                record: recordObj,
              };
              validDataStream.push((validRecords === 0 ? '' : ',') + JSON.stringify(item));
              validRecords++;
            }
          }
        },
        complete: async () => {
          validDataStream.push(']');
          invalidDataStream.push(']');
          validDataStream.push(null);
          invalidDataStream.push(null);
          invalidCsvDataStream.push(null);
        },
        error: (err) => {
          reject(err);
        },
      });

      invalidCsvDataStream.on('close', async () => {
        const invalidDataFilePath = await this.saveFileContents({
          uploadId,
          invalidRecords,
          totalRecords,
          validRecords,
        });
        resolve(invalidDataFilePath);
      });
    });
  }

  private async batchRun({
    allDataFilePath,
    headings,
    validator,
    _uploadId,
    extra,
  }: {
    _uploadId: string;
    allDataFilePath: string;
    headings: string[];
    validator: ValidateFunction;
    extra: any;
  }): Promise<IBatchItem[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const csvFileStream = await this.storageService.getFileStream(allDataFilePath);

        let recordsCount = 0,
          batchCount = 1;
        const batches: IBatchItem[] = [];
        const batchRecords: IDataItem[] = [];

        Papa.parse(csvFileStream, {
          dynamicTyping: false,
          skipEmptyLines: true,
          step: (results: Papa.ParseStepResult<any>) => {
            recordsCount++;
            const record = results.data;
            const recordObj = headings.reduce((acc, heading, index) => {
              acc[heading] = record[index];

              return acc;
            }, {});

            if (recordsCount > 1) {
              // skip headings
              const isValid = validator(recordObj);
              if (!isValid) {
                const errors = this.getErrorsObject(validator.errors);
                batchRecords.push({
                  index: recordsCount - 1,
                  errors: errors,
                  isValid: false,
                  record: recordObj,
                });
              } else {
                batchRecords.push({
                  index: recordsCount - 1,
                  isValid: true,
                  errors: {},
                  record: recordObj,
                });
              }
              if (batchRecords.length === batchLimit) {
                batches.push(
                  JSON.parse(
                    JSON.stringify({
                      uploadId: _uploadId,
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
          },
          complete() {
            if (batchRecords.length > 0) {
              batches.push({
                uploadId: _uploadId,
                data: batchRecords,
                batchCount,
                extra,
              });
            }
            resolve(batches);
          },
          error: (err) => {
            reject(err);
          },
        });
      } catch (error) {
        reject(error);
      }
    });
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

    return invalidDataFilePath;
  }

  private async processBatches({
    uploadId,
    headings,
    batches,
    onBatchInitialize,
  }: {
    batches: IBatchItem[];
    uploadId: string;
    headings: string[];
    onBatchInitialize: string;
  }): Promise<string> {
    return new Promise(async (resolve) => {
      const { validDataStream, invalidCsvDataStream, invalidDataStream } = this.getStreams({
        uploadId,
        headings,
      });

      const batchProcess = await Promise.all(
        batches.map((batch) => this.executeBatchInSandbox(batch, this.sandboxManager, onBatchInitialize))
      );
      const processedArray = batchProcess.flat();
      let totalRecords = 0,
        validRecords = 0,
        invalidRecords = 0;
      let processOutput, message: string;
      for (const processData of processedArray) {
        if (
          processData.output &&
          typeof (processData.output as any)?.output === 'object' &&
          !Array.isArray((processData.output as any)?.output)
        ) {
          processOutput = (processData.output as unknown as any).output;
          // eslint-disable-next-line @typescript-eslint/no-loop-func
          processOutput.data.forEach((item: any) => {
            totalRecords++;
            if (item.isValid) {
              validDataStream.push((validRecords === 0 ? '' : ',') + JSON.stringify(item));
              validRecords++;
            } else {
              message = Object.values(item.errors).join(', ');
              invalidDataStream.push((invalidRecords === 0 ? '' : ',') + JSON.stringify(item));
              invalidCsvDataStream.push(`"${totalRecords}","${message}","${Object.values(item.record).join('","')}"\n`);
              invalidRecords++;
            }
          });
        } else {
          console.log(processData.standardOutput, processData.standardError);
        }
      }
      validDataStream.push(']');
      invalidDataStream.push(']');
      validDataStream.push(null);
      invalidDataStream.push(null);
      invalidCsvDataStream.push(null);

      invalidCsvDataStream.on('close', async () => {
        const invalidDataFilePath = await this.saveFileContents({
          uploadId,
          invalidRecords,
          totalRecords,
          validRecords,
        });
        resolve(invalidDataFilePath);
      });
    });
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
