import * as fs from 'fs';
import * as dayjs from 'dayjs';
import * as Papa from 'papaparse';
import * as ExcelJS from 'exceljs';
import addFormats from 'ajv-formats';
import { PassThrough } from 'stream';
import addKeywords from 'ajv-keywords';
import { Injectable, BadRequestException } from '@nestjs/common';
import Ajv, { AnySchemaObject, ErrorObject, ValidateFunction } from 'ajv';

import { StorageService } from '@impler/shared/dist/services/storage';
import { UploadRepository, ValidatorRepository, FileRepository } from '@impler/dal';
import { ColumnTypesEnum, Defaults, FileMimeTypesEnum, ITemplateSchemaItem, UploadStatusEnum } from '@impler/shared';

import { APIMessages } from '@shared/constants';
import { FileNameService } from '@shared/services';
import { SManager, BATCH_LIMIT, MAIN_CODE } from '@shared/services/sandbox';
import { GetTemplateDetails } from 'app/template/usecases';

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
export class DoReview {
  constructor(
    private uploadRepository: UploadRepository,
    private storageService: StorageService,
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
    const schema = this.buildAJVSchema(JSON.parse(uploadInfo.customSchema));
    const validator = ajv.compile(schema);

    const uploadedFileInfo = await this.fileRepository.findById(uploadInfo._uploadedFileId);
    const validations = await this.validatorRepository.findOne({ _templateId: uploadInfo._templateId });

    let response: string;

    if (validations && validations.onBatchInitialize) {
      const batches = await this.batchRun({
        _uploadId,
        allDataFilePath: uploadedFileInfo.path,
        headings: uploadInfo.headings,
        validator,
        extra: uploadInfo.extra,
      });

      response = await this.processBatches({
        batches,
        headings: uploadInfo.headings,
        onBatchInitialize: validations.onBatchInitialize,
        uploadId: _uploadId,
      });
    } else {
      response = await this.normalRun({
        allDataFilePath: uploadedFileInfo.path,
        headings: uploadInfo.headings,
        uploadId: _uploadId,
        validator,
      });
    }

    // resetting uniqueItems
    uniqueItems = {};
    dateFormats = {};

    return response;
  }

  private buildAJVSchema(columns: ITemplateSchemaItem[]) {
    const formattedColumns: Record<string, ITemplateSchemaItem> = columns.reduce((acc, column) => {
      acc[column.key] = { ...column };

      return acc;
    }, {});
    const properties: Record<string, unknown> = columns.reduce((acc, column) => {
      acc[column.key] = this.getProperty(formattedColumns[column.key]);

      return acc;
    }, {});
    const requiredProperties: string[] = columns.reduce((acc, column) => {
      if (formattedColumns[column.key].isRequired) acc.push(column.key);

      return acc;
    }, []);

    // setting uniqueItems to empty set to avoid error
    columns.forEach((column) => {
      if (formattedColumns[column.key].isUnique) {
        uniqueItems[column.key] = new Set();
      }
      if (formattedColumns[column.key].type === ColumnTypesEnum.DATE) {
        if (
          Array.isArray(formattedColumns[column.key].dateFormats) &&
          formattedColumns[column.key].dateFormats.length > 0
        )
          dateFormats[column.key] = formattedColumns[column.key].dateFormats;
        else dateFormats[column.key] = Defaults.DATE_FORMATS;
      }
    });

    return {
      type: 'object',
      properties,
      required: requiredProperties,
      // additionalProperties: false,
    };
  }

  private getProperty(column: ITemplateSchemaItem): Record<string, unknown> {
    let property: Record<string, unknown> = {};

    switch (column.type) {
      case ColumnTypesEnum.STRING:
        property = {
          type: 'string',
        };
        break;
      case ColumnTypesEnum.NUMBER:
        property = {
          allOf: [{ type: 'integer' }, ...(!column.isRequired ? [{ type: ['integer', 'null'] }] : [])],
          ...(!column.isRequired && { default: null }),
        };
        break;
      case ColumnTypesEnum.SELECT:
        const selectValues =
          Array.isArray(column.selectValues) && column.selectValues.length > 0
            ? [...column.selectValues, ...(column.isRequired ? [] : [''])]
            : [];
        property = {
          type: 'string',
          enum: Array.from(new Set(selectValues)), // handle duplicate
          ...(!column.isRequired && { default: '' }),
        };
        break;
      case ColumnTypesEnum.REGEX:
        const [full, pattern, flags] = column.regex.match(/\/(.*)\/(.*)|(.*)/);

        property = { type: 'string', regexp: { pattern: pattern || full, flags: flags || '' } };
        break;
      case ColumnTypesEnum.EMAIL:
        property = {
          type: ['string', 'null'],
          format: 'email',
          default: null,
        };
        break;
      case ColumnTypesEnum.DATE:
        property = { type: ['string', 'null'], customDateChecker: true, default: null };
        break;
      case ColumnTypesEnum.ANY:
        property = { type: ['string', 'number', 'object', 'null'] };
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
      // customDateChecker
      case error.keyword === 'customDateChecker':
        message = ` must match format from [${dateFormats[field].toString()}]`;
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
        if (error.params.type === 'integer') {
          message = ` must be a number`;
        } else if (Array.isArray(error.params.type) && error.params.type.toString() === 'integer,null')
          message = ` must be a number or empty`;
        else message = ' ' + error.message;
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
    try {
      const sandbox = await sandboxManager.obtainSandbox(batchItem.uploadId);
      sandbox.clean();
      const sandboxPath = sandbox.getSandboxFolderPath();

      if (!fs.existsSync(sandboxPath)) {
        await sandbox.init();
      }

      fs.writeFileSync(
        `${sandboxPath}/input.json`,
        JSON.stringify({
          ...batchItem,
          sandboxPath: sandboxPath,
          chunkSize: BATCH_LIMIT,
          /*
           * fileName: "asdf",
           * extra: "",
           * totalRecords: "",
           */
        })
      );
      fs.writeFileSync(`${sandboxPath}/code.js`, onBatchInitialize);
      fs.writeFileSync(`${sandboxPath}/main.js`, MAIN_CODE);

      const nodeExecutablePath = process.execPath;

      return await sandbox.runCommandLine(`${nodeExecutablePath} main.js`);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  private getStreams({ uploadId, headings }: { uploadId: string; headings: string[] }) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('data');
    worksheet.columns = [
      { header: 'Index', key: 'index' },
      { header: 'Message', key: 'message' },
      ...headings.map((heading) => ({ header: heading, key: heading })),
    ];

    const validFilePath = this.fileNameService.getValidDataFilePath(uploadId);
    const invalidFilePath = this.fileNameService.getInvalidDataFilePath(uploadId);

    const invalidExcelDataFilePath = this.fileNameService.getInvalidExcelDataFilePath(uploadId);

    const invalidDataStream = new PassThrough();
    const validDataStream = new PassThrough();

    const validDataWriteStream = this.storageService.writeStream(
      validFilePath,
      validDataStream,
      FileMimeTypesEnum.JSON
    );
    const invalidDataWriteStream = this.storageService.writeStream(
      invalidFilePath,
      invalidDataStream,
      FileMimeTypesEnum.JSON
    );

    invalidDataStream.push(`[`);
    validDataStream.push(`[`);

    return {
      workbook,
      worksheet,

      validFilePath,
      invalidFilePath,
      invalidExcelDataFilePath,

      validDataStream,
      invalidDataStream,

      validDataWriteStream,
      invalidDataWriteStream,
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
      const {
        workbook,
        worksheet,
        invalidExcelDataFilePath,

        validDataStream,
        invalidDataStream,
        invalidDataWriteStream,
        validDataWriteStream,
      } = this.getStreams({
        uploadId,
        headings,
      });
      const csvFileStream = await this.storageService.getFileStream(allDataFilePath);

      let totalRecords = -1,
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

          if (totalRecords >= 1) {
            const recordObj: Record<string, unknown> = headings.reduce((acc, heading, index) => {
              acc[heading] = record[index];

              return acc;
            }, {});
            const isValid = validator({ ...recordObj });
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
              worksheet.addRow(Object.assign({ index: totalRecords, message }, recordObj)).commit();
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

          validDataStream.end();
          invalidDataStream.end();

          await invalidDataWriteStream.done();
          await validDataWriteStream.done();

          const sheetBuffer = await workbook.xlsx.writeBuffer();
          await this.storageService.uploadFile(invalidExcelDataFilePath, sheetBuffer as any, FileMimeTypesEnum.EXCELX);

          const invalidDataFilePath = await this.saveFileContents({
            uploadId,
            invalidRecords,
            totalRecords,
            validRecords,
          });
          resolve(invalidDataFilePath);
        },
        error: (err) => {
          reject(err);
        },
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

        let recordsCount = -1,
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

            if (recordsCount >= 1) {
              // skip headings
              const isValid = validator({ ...recordObj });
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
              if (batchRecords.length === BATCH_LIMIT) {
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

    const validDataFilePath = this.fileNameService.getValidDataFilePath(uploadId);
    const invalidDataFilePath = this.fileNameService.getInvalidDataFilePath(uploadId);

    const invalidExcelDataFileUrl = this.fileNameService.getInvalidExcelDataFileUrl(uploadId);

    const validDataFile = await this.makeFileEntry(validDataFileName, validDataFilePath);
    const invalidDataFile = await this.makeFileEntry(invalidDataFileName, invalidDataFilePath);

    await this.uploadRepository.update(
      { _id: uploadId },
      {
        status: UploadStatusEnum.REVIEWING,
        _validDataFileId: validDataFile._id,
        _invalidDataFileId: invalidDataFile._id,
        invalidCSVDataFileUrl: invalidExcelDataFileUrl,
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
      const {
        workbook,
        worksheet,
        invalidExcelDataFilePath,

        validDataStream,
        invalidDataStream,
        invalidDataWriteStream,
        validDataWriteStream,
      } = this.getStreams({
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
          processData &&
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
              worksheet.addRow(Object.assign({ index: totalRecords, message }, item.record)).commit();
              invalidRecords++;
            }
          });
        } else {
          console.log(processData);
        }
      }
      validDataStream.push(']');
      invalidDataStream.push(']');

      validDataStream.end();
      invalidDataStream.end();

      await invalidDataWriteStream.done();
      await validDataWriteStream.done();

      const sheetBuffer = await workbook.xlsx.writeBuffer();
      await this.storageService.uploadFile(invalidExcelDataFilePath, sheetBuffer as any, FileMimeTypesEnum.EXCELX);

      const invalidDataFilePath = await this.saveFileContents({
        uploadId,
        invalidRecords,
        totalRecords,
        validRecords,
      });
      resolve(invalidDataFilePath);
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
