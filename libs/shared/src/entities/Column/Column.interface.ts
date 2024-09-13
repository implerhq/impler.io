export enum ValidatorTypesEnum {
  RANGE = 'range',
  LENGTH = 'length',
}

export type RangeValidator = {
  validate: ValidatorTypesEnum.RANGE;
  min?: number;
  max?: number;
  errorMessage?: string;
};

export type LengthValidator = {
  validate: ValidatorTypesEnum.LENGTH;
  min?: number;
  max?: number;
  errorMessage?: string;
};

export type ValidatorType = RangeValidator | LengthValidator;

export interface IColumn {
  _id: string;
  name: string;
  key: string;
  description?: string;
  type: string;
  alternateKeys?: string[];
  isRequired?: boolean;
  isUnique?: boolean;
  isFrozen?: boolean;
  regex?: string;
  delimiter?: string;
  allowMultiSelect?: boolean;
  defaultValue?: string | number;
  regexDescription?: string;
  selectValues?: string[];
  dateFormats?: string[];
  sequence?: number;
  validators?: ValidatorType[];
  _templateId: string;
}

export interface ISchemaColumn extends IColumn {
  columnHeading: string;
}
