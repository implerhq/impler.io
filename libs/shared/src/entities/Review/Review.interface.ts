export interface IReviewData {
  limit: number;
  page: number;
  totalPages: number;
  totalRecords: number;
  data: Record<'index' | 'error' | string, string>[];
}
