export interface IColumn {
  _id: string;
  name: string;
  key: string;
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
  _templateId: string;
}

export interface ISchemaColumn extends IColumn {
  columnHeading: string;
}
