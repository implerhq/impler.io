export class ColumnEntity {
  _id?: string;

  name: string;

  columnKeys: string[];

  isRequired: boolean;

  isUnique: boolean;

  type: string;

  regex: string;

  regexDescription: string;

  selectValues: string[];

  sequence: number;

  templateId: string;
}
