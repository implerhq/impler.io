export interface IColumn {
  _id: string;
  name: string;
  key: string;
  type: string;
  alternateKeys?: string[];
  isRequired?: boolean;
  isUnique?: boolean;
  regex?: string;
  regexDescription?: string;
  selectValues?: string[];
  dateFormats?: string[];
  sequence?: number;
  _templateId: string;
}
