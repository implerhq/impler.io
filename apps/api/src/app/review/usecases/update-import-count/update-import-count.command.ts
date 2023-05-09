import { IsDefined, IsNumber, IsOptional } from 'class-validator';
import { BaseCommand } from '@shared/commands/base.command';

export class UpdateImportCountCommand extends BaseCommand {
  @IsDefined()
  @IsNumber()
  totalRecords: number;

  @IsOptional()
  @IsNumber()
  totalInvalidRecords: number;
}
