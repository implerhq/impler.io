import { ValidationType } from '@impler/client';

export enum ColumnTypesEnum {
  'STRING' = 'String',
  'NUMBER' = 'Number',
  'DATE' = 'Date',
  'EMAIL' = 'Email',
  'REGEX' = 'Regex',
  'SELECT' = 'Select',
  'ANY' = 'Any',
  'DOUBLE' = 'Double',
  'IMAGE' = 'Image',
}

export enum ColumnDelimiterEnum {
  'COMMA' = ',',
  'SEMICOLON' = ';',
}

export interface ISchemaItem {
  key: string;
  name: string;
  description?: string;
  alternateKeys?: string[];
  isRequired?: boolean;
  isUnique?: boolean;
  isFrozen?: boolean;
  selectValues?: string[];
  dateFormats?: string[];
  type?: ColumnTypesEnum;
  allowMultiSelect?: boolean;
  regex?: string;
  delimiter?: ColumnDelimiterEnum;
  defaultValue?: string | number;
  validations?: ValidationType[];
}

export interface ITemplateSchemaItem extends ISchemaItem {
  sequence: number;
  columnHeading: string;
}
