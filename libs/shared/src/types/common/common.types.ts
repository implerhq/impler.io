export type PaginationResult<T = any> = {
  page: number;
  data: T[];
  limit: number;
  totalPages: number;
  totalRecords: number;
};

export interface IErrorObject {
  error: string;
  message: string;
  statusCode: number;
}
