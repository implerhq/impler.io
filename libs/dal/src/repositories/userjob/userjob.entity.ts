export class UserJobEntity {
  _id: string;

  url: string;

  templateId: string;

  cron: string;

  headings: string[];

  createdOn: Date;
}
