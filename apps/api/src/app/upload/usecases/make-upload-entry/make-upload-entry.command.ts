import { IsDefined, IsString, IsOptional, IsJSON } from 'class-validator';
import { BaseCommand } from '@shared/commands/base.command';

export class MakeUploadEntryCommand extends BaseCommand {
  @IsDefined()
  file: Express.Multer.File;

  @IsDefined()
  @IsString()
  templateId: string;

  @IsOptional()
  @IsJSON()
  extra?: string;

  @IsOptional()
  @IsString()
  schema?: string;

  @IsOptional()
  @IsString()
  authHeaderValue?: string;
}
