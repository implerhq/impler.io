import { ValidationType } from '@impler/client';

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
  validations?: ValidationType[];
  _templateId: string;
}

export interface ISchemaColumn extends IColumn {
  columnHeading: string;
}
