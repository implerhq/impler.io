import { Injectable } from '@nestjs/common';
import { ColumnTypesEnum } from '@impler/shared';
import { ColumnEntity, MappingEntity } from '@impler/dal';
import Ajv, { ErrorObject, AnySchemaObject } from 'ajv';
import addFormats from 'ajv-formats';
import addKeywords from 'ajv-keywords';

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

// Unique keyword
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
export class AJVService {
  validate(columns: ColumnEntity[], mappings: MappingEntity[], data: any) {
    const schema = this.buildAJVSchema(columns, mappings);
    const validator = ajv.compile(schema);

    const valid = validator(data);
    const returnData = {
      invalid: [],
      valid: [],
    };
    if (!valid) {
      const errors: Record<number, any> = this.buildErrorRecords(validator.errors, data);

      returnData.invalid = Object.values(errors);
      // eslint-disable-next-line no-magic-numbers
      Object.keys(errors).forEach((index) => (data as any).splice(index as unknown as number, 1));
    }
    returnData.valid = data as any;
    // resetting uniqueItems
    uniqueItems = {};

    return returnData;
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
    // setting uniqueItems to empty set to avoid error
    mappings.forEach((mapping) => {
      if (formattedColumns[mapping._columnId].isUnique) {
        uniqueItems[mapping.columnHeading] = new Set();
      }
    });
    const objectSchema = {
      type: 'object',
      properties,
      required: requiredProperties,
      additionalProperties: false,
    };

    return {
      type: 'array',
      items: objectSchema,
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
  private buildErrorRecords(errors: ErrorObject[], data?: any[]) {
    let index: string, field: string, message: string;

    return errors.reduce((acc, error) => {
      [, index, field] = error.instancePath.split('/');
      // eslint-disable-next-line no-magic-numbers
      message = this.getMessage(error, field || error.schema[0]);

      if (acc[index]) {
        acc[index].message += `, ${message}`;
      } else
        acc[index] = {
          index,
          message,
          ...data[index],
        };

      return acc;
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
}
