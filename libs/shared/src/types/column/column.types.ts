export enum ColumnTypesEnum {
  'STRING' = 'String',
  'NUMBER' = 'Number',
  'DATE' = 'Date',
  'EMAIL' = 'Email',
  'REGEX' = 'Regex',
  'SELECT' = 'Select',
  'ANY' = 'Any',
}

export interface ISchemaItem {
  key: string;
  isRequired?: boolean;
  isUnique?: boolean;
  selectValues?: string[];
  type?: ColumnTypesEnum;
  regex?: string;
}
