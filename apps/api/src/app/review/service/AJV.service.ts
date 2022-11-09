import { Injectable } from '@nestjs/common';
import { ColumnTypesEnum } from '@impler/shared';
import { ColumnEntity, MappingEntity } from '@impler/dal';
import Ajv, { ErrorObject } from 'ajv';
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
    const uniqueItemProperties = mappings.reduce((acc, mapping) => {
      if (formattedColumns[mapping._columnId].isUnique) acc.push(mapping.columnHeading);

      return acc;
    }, []);
    const objectSchema = {
      type: 'object',
      properties,
      required: requiredProperties,
      additionalProperties: false,
    };

    return {
      type: 'array',
      items: objectSchema,
      uniqueItemProperties,
    };
  }
  private getProperty(column: ColumnEntity) {
    /*
     * ${1} is record object
     * ${1#} is record index
     * ${0#} is key
     * ${0} is value
     */
    switch (column.type) {
      case ColumnTypesEnum.STRING:
        return {
          type: 'string',
          // errorMessage: { type: `\${1#}${this.indexSeperator}${heading} is not valid string` },
        };
      case ColumnTypesEnum.NUMBER:
        return {
          type: 'number',
          // errorMessage: { type: `\${1#}${this.indexSeperator}${heading} is not valid number` },
        };
      case ColumnTypesEnum.SELECT:
        return {
          type: 'string',
          enum: column.selectValues || [],
          /*
           * errorMessage: {
           *   enum: `\${1#}${this.indexSeperator}${heading} value should be from [${column.selectValues.join(',')}]`,
           *   type: `\${1#}${this.indexSeperator}${heading} is not valid string value`,
           * },
           */
        };
      case ColumnTypesEnum.REGEX:
        const [full, pattern, flags] = column.regex.match(/\/(.*)\/(.*)|(.*)/);

        return { type: 'string', regexp: { pattern: pattern || full, flags: flags || '' } };
      case ColumnTypesEnum.EMAIL:
        return { type: 'string', format: 'email' };
      case ColumnTypesEnum.DATE:
        return { type: 'string', format: 'custom-date-time' };
      case ColumnTypesEnum.ANY:
        return { type: ['string', 'number', 'object'] };
      default:
        throw new Error(`Column type ${column.type} is not supported`);
    }
  }
  private buildErrorRecords(errors: ErrorObject[], data?: any[]) {
    let index: string, field: string, message: string;

    return errors.reduce((acc, error) => {
      [, index, field] = error.instancePath.split('/');
      message = this.getMessage(error, field);

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
    switch (error.keyword) {
      case 'type':
        message = error.message;
        break;
      case 'enum':
        message = ` must be from [${error.params.allowedValues}]`;
        break;
      case 'regexp':
        message = ` must match pattern ${new RegExp(
          error.parentSchema?.regexp?.pattern,
          error.parentSchema?.regexp?.flags || ''
        ).toString()}`;
        break;
      case 'pattern':
        message = ` must match pattern ${error.params.pattern}`;
        break;
      default:
        return ` contains invalid data`;
    }

    return '`' + field + '`' + message;
  }
}
