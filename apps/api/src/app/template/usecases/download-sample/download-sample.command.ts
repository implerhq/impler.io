import { IsOptional, IsArray } from 'class-validator';
import { BaseCommand } from '@shared/commands/base.command';

export class DownloadSampleCommand extends BaseCommand {
  @IsArray()
  @IsOptional()
  data: Record<string, unknown>[];

  @IsArray()
  @IsOptional()
  schema: Record<string, unknown>[];
}
