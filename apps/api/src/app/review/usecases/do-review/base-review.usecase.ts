import * as fs from 'fs';
import * as dayjs from 'dayjs';
import * as Papa from 'papaparse';
import { Writable } from 'stream';
import addFormats from 'ajv-formats';
import addKeywords from 'ajv-keywords';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import Ajv, { AnySchemaObject, ErrorObject, ValidateFunction } from 'ajv';

import { ValidatorErrorMessages } from '@shared/types/review.types';
import { SManager, BATCH_LIMIT, MAIN_CODE, ExecuteIsolateResult } from '@shared/services/sandbox';
import {
  ColumnTypesEnum,
  Defaults,
  ITemplateSchemaItem,
  LengthValidatorType,
  RangeValidatorType,
  ValidatorTypesEnum,
} from '@impler/shared';

dayjs.extend(customParseFormat);

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
interface IRunData {
  extra: any;
  uploadId: string;
  headings: string[];
  csvFileStream: any;
  dataStream: Writable;
  validator: ValidateFunction;
  numberColumnHeadings: Set<string>;
  dateFormats: Record<string, string[]>;
  uniqueCombinations: Record<string, string[]>;
  validatorErrorMessages: ValidatorErrorMessages;
  multiSelectColumnHeadings: Record<string, string>;
}

interface ISaveResults {
  uploadId: string;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
}

export class BaseReview {
  private sandboxManager: SManager;
  constructor() {
    this.sandboxManager = new SManager();
  }

  buildAJVSchema({
    columns,
    dateFormats,
    uniqueItems,
  }: {
    columns: ITemplateSchemaItem[];
    dateFormats: Record<string, string[]>;
    uniqueItems: Record<string, Set<any>>;
  }) {
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
    const rangeValidator = column.validators?.find(
      (validator) => validator.validate === ValidatorTypesEnum.RANGE
    ) as RangeValidatorType;
    const lengthValidator = column.validators?.find(
      (validator) => validator.validate === ValidatorTypesEnum.LENGTH
    ) as LengthValidatorType;

    switch (column.type) {
      case ColumnTypesEnum.STRING:
        property = {
          type: 'string',
          ...(typeof lengthValidator?.min === 'number' && { minLength: lengthValidator?.min }),
          ...(typeof lengthValidator?.max === 'number' && { maxLength: lengthValidator?.max }),
        };
        break;
      case ColumnTypesEnum.NUMBER:
      case ColumnTypesEnum.DOUBLE:
        property = {
          ...(column.type === ColumnTypesEnum.NUMBER && { multipleOf: 1 }),
          type: ['number', 'null'],
          ...(!column.isRequired && { default: null }),
          ...(typeof rangeValidator?.min === 'number' && { minimum: rangeValidator?.min }),
          ...(typeof rangeValidator?.max === 'number' && { maximum: rangeValidator?.max }),
        };
        break;
      case ColumnTypesEnum.SELECT:
      case ColumnTypesEnum.IMAGE:
        const selectValues =
          Array.isArray(column.selectValues) && column.selectValues.length > 0
            ? [...column.selectValues, ...(column.isRequired ? [] : [''])]
            : [''];
        if (column.allowMultiSelect)
          property = {
            type: 'array',
            items: {
              type: 'string',
              enum: selectValues,
            },
          };
        else
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

  private getErrorsObject(
    errors: ErrorObject[],
    dateFormats: Record<string, string[]>,
    validatorErrorMessages: ValidatorErrorMessages,
    uniqueCombinations: Record<string, string[]>
  ): Record<string, string> {
    let field: string;

    return errors.reduce((obj, error) => {
      if (error.keyword === 'required') field = error.params.missingProperty;
      else [, field] = error.instancePath.split('/');

      field = field.replace(/~1/g, '/');
      if (!!uniqueCombinations[error.keyword]) {
        uniqueCombinations[error.keyword].forEach((columnKey) => {
          obj[columnKey] = this.getMessage({
            error,
            data: error.data,
            field: columnKey,
            dateFormats,
            uniqueCombinations,
            validatorErrorMessages,
          });
        });
      } else
        obj[field] = this.getMessage({
          error,
          data: error.data,
          field: field || error.schema[0],
          dateFormats,
          uniqueCombinations,
          validatorErrorMessages,
        });

      return obj;
    }, {});
  }

  private getMessage({
    data,
    dateFormats,
    error,
    field,
    uniqueCombinations,
    validatorErrorMessages,
  }: {
    field: string;
    data: unknown;
    error: ErrorObject;
    dateFormats: Record<string, string[]>;
    uniqueCombinations: Record<string, string[]>;
    validatorErrorMessages?: ValidatorErrorMessages;
  }): string {
    let message = '';
    switch (true) {
      // maximum length case
      case error.keyword === 'maxLength':
        message =
          validatorErrorMessages?.[field]?.[ValidatorTypesEnum.LENGTH] ||
          `Length must be less than or equal to ${error.params.limit}`;
        break;
      // maximum length case
      case error.keyword === 'minLength':
        message =
          validatorErrorMessages?.[field]?.[ValidatorTypesEnum.LENGTH] ||
          `Length must be greater than or equal to ${error.params.limit}`;
        break;
      // maximum number case
      case error.keyword === 'maximum':
        message =
          validatorErrorMessages?.[field]?.[ValidatorTypesEnum.RANGE] ||
          `${String(data)} must be less than or equal to ${error.params.limit}`;
        break;
      // minimum number case
      case error.keyword === 'minimum':
        message =
          validatorErrorMessages?.[field]?.[ValidatorTypesEnum.RANGE] ||
          `${String(data)} must be greater than or equal to ${error.params.limit}`;
        break;
      // empty string case
      case error.keyword === 'emptyCheck':
      case error.keyword === 'required':
        message = `This field is required`;
        break;
      // customDateChecker
      case error.keyword === 'customDateChecker':
        message = `${String(data)} must match date format from [${dateFormats[field].toString()}]`;
        break;
      // uniqueCheck
      case error.keyword === 'uniqueCheck':
      case error.keyword === 'uniqueItemProperties':
        message = `${String(data)} already taken! Please enter unique value`;
        break;
      // custom date format
      case error.keyword === 'format' && error.params.format === 'custom-date-time':
        message = `${String(data)} is not a valid date`;
        break;
      // common cases
      case error.keyword === 'type':
        if (error.params.type === 'integer') {
          message = `${String(data)} must be a number`;
        } else if (Array.isArray(error.params.type) && error.params.type.toString() === 'integer,null')
          message = `${String(data)} must be a number or empty`;
        else if (error.params.type === 'number') message = `${String(data)} must be a number`;
        else if (Array.isArray(error.params.type) && error.params.type.toString() === 'number,null')
          message = `${String(data)} must be a number or empty`;
        else message = ' ' + error.message;
        break;
      case error.keyword === 'enum':
        message = `${String(data)} must be from list [${error.params.allowedValues}]`;
        break;
      case error.keyword === 'regexp':
        message = `${String(data)} must match the pattern ${new RegExp(
          error.parentSchema?.regexp?.pattern,
          error.parentSchema?.regexp?.flags || ''
        ).toString()}`;
        break;
      case error.keyword === 'pattern':
        message = `${String(data)} must match the pattern of ${error.params.pattern}`;
        break;
      case error.keyword === 'format':
        message = `${String(data)} must be a valid ${error.params.format}`;
        break;
      case !!uniqueCombinations[error.keyword]:
        message =
          validatorErrorMessages?.[field]?.[ValidatorTypesEnum.UNIQUE_WITH] ||
          `Value should be unique for combination of ${uniqueCombinations[error.keyword].toString()}`;
        break;
      default:
        message = ` contains invalid data`;
        break;
    }

    return message;
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
  formatRecord({
    record,
    headings,
    numberColumnHeadings,
    multiSelectColumnHeadings,
  }: {
    headings: string[];
    record: Record<string, any>;
    numberColumnHeadings: Set<string>;
    multiSelectColumnHeadings: Record<string, string>;
  }) {
    return headings.reduce(
      (acc, heading, index) => {
        if (heading === '_') return acc;
        let val = record[index];

        if (numberColumnHeadings.has(heading)) val = val !== '' && !isNaN(val) ? Number(val) : val;
        if (typeof val === 'string') val = val.trim();
        if (multiSelectColumnHeadings[heading]) {
          if (val)
            val = val
              .replace(
                new RegExp(`^[${multiSelectColumnHeadings[heading]}]+|[${multiSelectColumnHeadings[heading]}]+$`, 'g'),
                ''
              )
              .replace(
                new RegExp(`[${multiSelectColumnHeadings[heading]}]{2,}`, 'g'),
                multiSelectColumnHeadings[heading]
              );
          acc.checkRecord[heading] = !val ? [] : val.split(multiSelectColumnHeadings[heading]);
        } else acc.checkRecord[heading] = val;

        acc.passRecord[heading] = val;

        return acc;
      },
      {
        checkRecord: {},
        passRecord: {},
      }
    );
  }
  async normalRun({
    csvFileStream,
    validator,
    uploadId,
    headings,
    dateFormats,
    dataStream,
    uniqueCombinations,
    numberColumnHeadings,
    validatorErrorMessages,
    multiSelectColumnHeadings,
  }: IRunData): Promise<ISaveResults> {
    return new Promise(async (resolve, reject) => {
      let totalRecords = -1,
        invalidRecords = 0,
        validRecords = 0;
      Papa.parse(csvFileStream, {
        dynamicTyping: false,
        skipEmptyLines: true,
        step: (results: Papa.ParseStepResult<any>) => {
          totalRecords++;
          const record = results.data;

          if (totalRecords >= 1) {
            const recordObj: {
              checkRecord: Record<string, unknown>;
              passRecord: Record<string, unknown>;
            } = this.formatRecord({ headings, multiSelectColumnHeadings, record, numberColumnHeadings });
            const validationResultItem = this.validateRecord({
              index: totalRecords,
              checkRecord: recordObj.checkRecord,
              passRecord: recordObj.passRecord,
              validator,
              dateFormats,
              uniqueCombinations,
              validatorErrorMessages,
            });
            if (validationResultItem.isValid) {
              validRecords++;
            } else {
              invalidRecords++;
            }
            dataStream.write(validationResultItem);
          }
        },
        complete: async () => {
          dataStream.end();
          resolve({
            uploadId,
            invalidRecords,
            totalRecords,
            validRecords,
          });
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  }

  validateRecord({
    index,
    passRecord,
    checkRecord,
    validator,
    dateFormats,
    uniqueCombinations,
    validatorErrorMessages,
  }: {
    index: number;
    validator: ValidateFunction;
    passRecord: Record<string, any>;
    checkRecord: Record<string, any>;
    dateFormats: Record<string, string[]>;
    uniqueCombinations: Record<string, string[]>;
    validatorErrorMessages?: Record<string, { string: Record<string, string> }>;
  }) {
    const isValid = validator(checkRecord, {
      instancePath: `/${index}`,
      parentData: undefined,
      parentDataProperty: '',
      rootData: [],
      dynamicAnchors: undefined,
    });
    if (!isValid) {
      const errors = this.getErrorsObject(validator.errors, dateFormats, validatorErrorMessages, uniqueCombinations);

      return {
        index,
        errors: errors,
        isValid: false,
        record: passRecord,
        updated: {},
      };
    } else {
      return {
        index,
        isValid: true,
        record: passRecord,
        errors: {},
        updated: {},
      };
    }
  }

  getAjvValidator(
    dateFormats: Record<string, string[]>,
    uniqueItems: Record<string, Set<any>>,
    uniqueCombinations: Record<string, string[]>
  ) {
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

    // Empty keyword
    ajv.addKeyword({
      keyword: 'emptyCheck',
      schema: false,
      compile: () => {
        return (data) =>
          data === undefined || data === null || data === '' || (Array.isArray(data) && data.length === 0)
            ? false
            : true;
      },
    });

    ajv.addKeyword('customDateChecker', {
      keyword: 'customDateChecker',
      validate: function (_valid, date, _schema, dataPath) {
        if (date === null) return true;

        return dayjs(date, [...dateFormats[dataPath.parentDataProperty]], true).isValid();
      },
    });

    ajv.addKeyword({
      keyword: 'uniqueCheck',
      schema: false, // keyword value is not used, can be true
      validate: function (data: any, dataPath: AnySchemaObject) {
        if (!data) return true;
        if (uniqueItems[dataPath.parentDataProperty].has(data)) {
          return false;
        }
        uniqueItems[dataPath.parentDataProperty].add(data);

        return true;
      },
    });

    const valuesMap = new Map();
    Object.keys(uniqueCombinations).forEach((keyword) => {
      valuesMap.set(keyword, new Set());
      ajv.addKeyword({
        keyword,
        type: 'object',
        validate: function (schema, data) {
          const fields = uniqueCombinations[keyword];

          const fullName = fields.map((field) => `${data[field]}`).join(', ');
          if (valuesMap.get(keyword).has(fullName)) {
            return false;
          }
          valuesMap.get(keyword).add(fullName);

          return true;
        },
      });
    });

    return ajv;
  }

  getUniqueKey(uniqueKey: string) {
    return 'unique' + uniqueKey.replace(/\s+/g, '');
  }

  async batchRun({
    headings,
    validator,
    uploadId,
    extra,
    csvFileStream,
    dateFormats,
    uniqueCombinations,
    numberColumnHeadings,
    validatorErrorMessages,
    multiSelectColumnHeadings,
  }: IRunData): Promise<IBatchItem[]> {
    return new Promise(async (resolve, reject) => {
      try {
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
            const recordObj: {
              checkRecord: Record<string, unknown>;
              passRecord: Record<string, unknown>;
            } = this.formatRecord({ headings, multiSelectColumnHeadings, record, numberColumnHeadings });
            if (recordsCount >= 1) {
              const validationResultItem = this.validateRecord({
                index: recordsCount,
                checkRecord: recordObj.checkRecord,
                passRecord: recordObj.passRecord,
                validator,
                dateFormats,
                uniqueCombinations,
                validatorErrorMessages,
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
          },
          complete() {
            if (batchRecords.length > 0) {
              batches.push({
                uploadId,
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

  async processBatches({
    batches,
    forItem,
    onError,
    dataStream,
    onBatchInitialize,
  }: {
    uploadId: string;
    dataStream: Writable;
    batches: IBatchItem[];
    onBatchInitialize: string;
    onError?: (error: ExecuteIsolateResult) => void;
    forItem?: (item: any) => void;
  }): Promise<void> {
    return new Promise(async (resolve) => {
      const batchProcess = await Promise.all(
        batches.map((batch) => this.executeBatchInSandbox(batch, this.sandboxManager, onBatchInitialize))
      );
      const processedArray = batchProcess.flat();

      let processOutput: {
        uploadId: string;
        data: any[];
        batchCount: number;
        sandboxPath: string;
        chunkSize: number;
      };

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
            dataStream.write(item);
            forItem?.(item);
          });
        } else {
          console.log(processData);
          onError?.(processData);
        }
      }
      dataStream.end();
      resolve();
    });
  }
}
