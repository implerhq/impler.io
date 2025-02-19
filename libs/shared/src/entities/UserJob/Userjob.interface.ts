export interface IUserJob {
  _id: string;
  url: string;
  cron: string;
  status: string;
  nextRun?: Date;
  endsOn?: Date;
  headings: string[];
  _templateId: string;
}
