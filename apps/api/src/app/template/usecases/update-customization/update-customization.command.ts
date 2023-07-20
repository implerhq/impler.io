import { IsString, IsOptional } from 'class-validator';
import { BaseCommand } from '@shared/commands/base.command';

export class UpdateCustomizationCommand extends BaseCommand {
  @IsOptional()
  @IsString()
  recordFormat?: string;

  @IsString()
  @IsOptional()
  chunkFormat: string;

  @IsString()
  @IsOptional()
  combinedFormat?: string;
}
