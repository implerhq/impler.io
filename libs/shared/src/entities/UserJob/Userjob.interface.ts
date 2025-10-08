export enum FilterOperationEnum {
  CONTAINS = 'contains',
  EQUALS = 'equals',
  STARTSWITH = 'startsWith',
  ENDSWITH = 'endsWith',
  MATCHES = 'matches',
}

export interface IFilter {
  field: string;
  operation: FilterOperationEnum;
  value: string;
}

export interface IUserJob {
  _id: string;
  url: string;
  cron: string;
  status: string;
  nextRun?: Date;
  endsOn?: Date;
  headings: string[];
  _templateId: string;
  filters?: IFilter[];
}
