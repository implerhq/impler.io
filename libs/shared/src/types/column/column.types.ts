export enum ColumnTypesEnum {
  'STRING' = 'String',
  'NUMBER' = 'Number',
  'DATE' = 'Date',
  'EMAIL' = 'Email',
  'REGEX' = 'Regex',
  'SELECT' = 'Select',
  'ANY' = 'Any',
  'DOUBLE' = 'Double',
}

export interface ISchemaItem {
  key: string;
  name: string;
  alternateKeys?: string[];
  isRequired?: boolean;
  isUnique?: boolean;
  selectValues?: string[];
  dateFormats?: string[];
  type?: ColumnTypesEnum;
  allowMultiSelect?: boolean;
  regex?: string;
  defaultValue?: string | number;
}

export interface ITemplateSchemaItem extends ISchemaItem {
  sequence: number;
  columnHeading: string;
}
