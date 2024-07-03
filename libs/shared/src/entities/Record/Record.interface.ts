export interface IRecord {
  _id: string;
  index: number;
  isValid: boolean;
  record: Record<string, any>;
  errors: Record<string, string>;
  updated: Record<string, boolean>;
}
