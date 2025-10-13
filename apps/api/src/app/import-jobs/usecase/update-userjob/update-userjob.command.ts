import { IFilter } from '@impler/shared';

export class UpdateUserJobCommand {
  url: string;

  _templateId: string;

  cron: string;

  endsOn?: Date;

  headings: string[];

  status: string;

  nextRun?: Date;

  filters?: IFilter[];
}
