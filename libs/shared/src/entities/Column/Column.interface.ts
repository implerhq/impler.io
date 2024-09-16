export enum ValidatorTypesEnum {
  RANGE = 'range',
  LENGTH = 'length',
  UNIQUE_WITH = 'unique_with',
}

export type RangeValidatorType = {
  validate: ValidatorTypesEnum.RANGE;
  min?: number;
  max?: number;
  errorMessage?: string;
};

export type LengthValidatorType = {
  validate: ValidatorTypesEnum.LENGTH;
  min?: number;
  max?: number;
  errorMessage?: string;
};

export type UniqueWithValidatorType = {
  validate: ValidatorTypesEnum.UNIQUE_WITH;
  uniqueKey?: string;
  errorMessage?: string;
};

export type ValidatorType = RangeValidatorType | LengthValidatorType | UniqueWithValidatorType;

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
