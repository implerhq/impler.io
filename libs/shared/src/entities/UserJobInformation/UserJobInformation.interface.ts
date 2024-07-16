export interface IUserJobInformation {
  _id?: string;

  url: string;

  _templateId: string;

  cron: string;

  headings: string[];

  createdOn: Date;
}
