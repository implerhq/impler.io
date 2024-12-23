export class UpdateUserJobCommand {
  url: string;

  _templateId: string;

  cron: string;

  endsOn?: Date;

  headings: string[];

  status: string;
}
