import { IsOptional, IsArray, IsJSON } from 'class-validator';
import { BaseCommand } from '@shared/commands/base.command';

export class DownloadSampleCommand extends BaseCommand {
  @IsArray()
  @IsOptional()
  data: Record<string, unknown>[];

  @IsJSON()
  @IsOptional()
  schema?: string;
}
