export class ColumnEntity {
  _id?: string;

  name: string;

  key: string;

  alternateKeys?: string[];

  isRequired: boolean;

  isUnique: boolean;

  type: string;

  regex?: string;

  regexDescription?: string;

  selectValues?: string[];

  sequence?: number;

  _templateId: string;
}
