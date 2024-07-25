export class ColumnEntity {
  _id?: string;

  name: string;

  key: string;

  alternateKeys?: string[];

  isRequired?: boolean;

  isUnique?: boolean;

  isFrozen?: boolean;

  type: string;

  regex?: string;

  delimiter?: string;

  allowMultiSelect?: boolean;

  regexDescription?: string;

  selectValues?: string[];

  dateFormats?: string[];

  sequence?: number;

  _templateId: string;

  defaultValue?: string | number;
}
