export interface IColumn {
  _id: string;
  name: string;
  key: string;
  type: string;
  alternateKeys?: string[];
  apiResponseKey?: string;
  isRequired?: boolean;
  isUnique?: boolean;
  regex?: string;
  regexDescription?: string;
  selectValues?: string[];
  sequence?: number;
  _templateId: string;
}
