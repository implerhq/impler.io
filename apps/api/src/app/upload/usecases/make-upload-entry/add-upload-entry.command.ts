import { IsDefined, IsString, IsOptional, IsJSON, IsArray, IsNumber } from 'class-validator';
import { BaseCommand } from '../../../shared/commands/base.command';

export class AddUploadEntryCommand extends BaseCommand {
  @IsDefined()
  @IsString()
  templateId: string;

  @IsDefined()
  @IsString()
  fileId: string;

  @IsDefined()
  @IsString()
  uploadId: string;

  @IsOptional()
  @IsJSON()
  extra?: string;

  @IsOptional()
  @IsString()
  authHeaderValue?: string;

  @IsOptional()
  @IsArray()
  headings?: string[];

  @IsOptional()
  @IsNumber()
  totalRecords?: number;
}
