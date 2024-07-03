export type PaginationResult<T = any> = {
  page: number;
  data: T[];
  limit: number;
  totalPages: number;
  totalRecords: number;
};
