export class RecordEntity {
  _id?: string;

  index: number;

  isValid: boolean;

  errors: Record<string, string>;

  warnings: Record<string, string>;

  record: Record<string, any>;

  updated: Record<string, boolean>;
}
