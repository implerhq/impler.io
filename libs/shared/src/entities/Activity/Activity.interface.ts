export interface IHistoryRecord {
  _id: string;
  totalRecords: number;
  status: string;
  uploadedDate: string;
  validRecords: number;
  name: string;
}

export interface IHistoryData {
  data: IHistoryRecord[];
  limit: number;
  page: number;
  totalPages: number;
  totalRecords: number;
}

export interface ISummaryData {
  yearly: number;
  monthly: number;
  weekly: number;
  uploads: { date: string; count: string }[];
}
