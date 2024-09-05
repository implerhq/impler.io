import { IRecord } from '../Record';

export interface IReviewData {
  limit: number;
  page: number;
  totalPages: number;
  totalRecords: number;
  data: IRecord[];
}

export interface IReplaceData {
  find?: string;
  replace?: string;
  column: string;
  caseSensitive?: boolean;
  matchEntireCell?: boolean;
}
