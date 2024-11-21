import { ValidationTypesEnum } from '@impler/client';
import { ColumnDelimiterEnum, ColumnTypesEnum } from '@impler/shared';

export class ValidationCommand {
  validate: ValidationTypesEnum;
  min?: number;
  max?: number;
  uniqueKey?: string;
  errorMessage?: string;
}

export class AddColumnCommand {
  name: string;

  key: string;

  description?: string;

  alternateKeys? = [];

  isRequired? = false;

  isUnique? = false;

  isFrozen? = false;

  type: ColumnTypesEnum;

  regex?: string;

  regexDescription?: string;

  selectValues?: string[];

  dateFormats?: string[];

  sequence?: number;

  _templateId: string;

  defaultValue?: string | number;

  allowMultiSelect?: boolean;

  delimiter?: ColumnDelimiterEnum;

  validations?: ValidationCommand[];
}
