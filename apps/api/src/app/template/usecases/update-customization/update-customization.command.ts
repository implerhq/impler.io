import { IsDefined, IsString, IsOptional } from 'class-validator';
import { BaseCommand } from '@shared/commands/base.command';

export class UpdateCustomizationCommand extends BaseCommand {
  @IsDefined()
  @IsString()
  recordFormat: string;

  @IsString()
  @IsOptional()
  chunkFormat: string;
}
