import { ValidatorTypesEnum } from '@impler/client';
import { ColumnDelimiterEnum, ColumnTypesEnum } from '@impler/shared';

export class ValidatorCommand {
  validate: ValidatorTypesEnum;
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

  validators?: ValidatorCommand[];
}
