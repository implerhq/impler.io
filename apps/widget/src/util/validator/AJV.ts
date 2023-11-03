import dayjs from 'dayjs';
import { ColumnTypesEnum, Defaults, ISchemaColumn } from '@impler/shared';
import { variables } from '@config';

type SchemaItemType =
  | {
      type: ColumnTypesEnum.STRING;
    }
  | {
      type: ColumnTypesEnum.NUMBER;
    }
  | {
      type: ColumnTypesEnum.SELECT;
      enum: (string | number)[];
    }
  | {
      type: ColumnTypesEnum.REGEX;
      regex?: string;
    }
  | {
      type: ColumnTypesEnum.DATE;
      dateFormats: string[];
    }
  | {
      type: ColumnTypesEnum.ANY;
    };

type Schema = {
  properties: Record<string, SchemaItemType>;
  required: string[];
};

function getProperty(column: ISchemaColumn): SchemaItemType {
  switch (column.type) {
    case ColumnTypesEnum.STRING:
      return {
        type: ColumnTypesEnum.STRING,
      };
    case ColumnTypesEnum.NUMBER:
      return {
        type: ColumnTypesEnum.NUMBER,
      };
    case ColumnTypesEnum.SELECT:
      const selectValues =
        Array.isArray(column.selectValues) && column.selectValues.length > variables.baseIndex
          ? [...column.selectValues, ...(column.isRequired ? [] : [''])]
          : [];

      return {
        type: ColumnTypesEnum.SELECT,
        enum: selectValues,
      };
    case ColumnTypesEnum.REGEX:
      return {
        type: ColumnTypesEnum.REGEX,
        regex: column.regex,
      };
    case ColumnTypesEnum.EMAIL:
      return {
        type: ColumnTypesEnum.REGEX,
        regex: '/^[^s@]+@[^s@]+.[^s@]+$/',
      };
    case ColumnTypesEnum.DATE:
      return {
        type: ColumnTypesEnum.DATE,
        dateFormats: column.dateFormats || Defaults.DATE_FORMATS,
      };
    case ColumnTypesEnum.ANY:
    default:
      return {
        type: ColumnTypesEnum.ANY,
      };
  }
}

function buildAJVSchema(columns: ISchemaColumn[]): Schema {
  const formattedColumns: Record<string, ISchemaColumn> = columns.reduce((acc, column) => {
    acc[column.columnHeading] = { ...column };

    return acc;
  }, {});
  const properties: Record<string, SchemaItemType> = columns.reduce((acc, column) => {
    acc[column.columnHeading] = getProperty(formattedColumns[column.columnHeading]);

    return acc;
  }, {});
  const requiredProperties: string[] = columns.reduce((acc, column) => {
    if (formattedColumns[column.columnHeading].isRequired) acc.push(column.columnHeading);

    return acc;
  }, [] as string[]);

  return {
    properties,
    required: requiredProperties,
  };
}

function validator(schema: Schema, key: string, value: string | number): boolean {
  if (schema.required.includes(key)) {
    if (typeof value === 'undefined' || value === null || (typeof value === 'string' && value.trim() === '')) {
      return false; // Required field cannot be empty
    }
  }

  if (schema.properties.hasOwnProperty(key)) {
    const keySchema = schema.properties[key];
    if (keySchema.type === ColumnTypesEnum.STRING && typeof value === 'string') {
      return true;
    }
    if (keySchema.type === ColumnTypesEnum.NUMBER && Number.isInteger(value)) {
      return true;
    }
    if (keySchema.type === ColumnTypesEnum.SELECT && keySchema.enum.includes(value)) {
      return true;
    }
    if (keySchema.type === ColumnTypesEnum.REGEX) {
      if (keySchema.regex) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const [, pattern, flags] = keySchema.regex.match(/\/(.*)\/(.*)|(.*)/);

        return new RegExp(pattern, flags).test(String(value));
      } else return true;
    }
    if (keySchema.type === ColumnTypesEnum.DATE) {
      return dayjs(value, keySchema.dateFormats).isValid();
    }
    if (keySchema.type === ColumnTypesEnum.ANY) {
      return true;
    }
  }

  return false;
}

export function getValidator(columns: ISchemaColumn[]): (key: string, value: string | number) => boolean {
  const schema = buildAJVSchema(columns);

  return validator.bind(null, schema);
}
