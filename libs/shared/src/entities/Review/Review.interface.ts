import { IRecord } from '../Record';

export interface IReviewData {
  limit: number;
  page: number;
  totalPages: number;
  totalRecords: number;
  data: IRecord[];
}
