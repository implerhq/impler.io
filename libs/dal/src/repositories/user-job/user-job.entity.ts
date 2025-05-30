export class UserJobEntity {
  _id?: string;

  url: string;

  _templateId: string;

  cron: string;

  nextRun: Date;

  endsOn: Date;

  headings: string[];

  extra: string;

  externalUserId: string;

  status: string;

  authHeaderValue: string;

  customRecordFormat: string;

  customChunkFormat: string;

  customSchema: string;
}
