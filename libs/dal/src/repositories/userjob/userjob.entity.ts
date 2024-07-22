export class UserJobEntity {
  _id?: string;

  url: string;

  _templateId: string;

  cron: string;

  headings: string[];

  extra: string;

  userId: string;

  status: string;

  customRecordFormat: string;

  customChunkFormat: string;

  customSchema: string;
}
