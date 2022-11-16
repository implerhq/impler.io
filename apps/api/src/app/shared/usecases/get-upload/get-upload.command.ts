import { IsDefined, IsMongoId, IsOptional, IsString } from 'class-validator';
import { BaseCommand } from '../../commands/base.command';

export class GetUploadCommand extends BaseCommand {
  @IsDefined()
  @IsMongoId()
  uploadId: string;

  @IsOptional()
  @IsString()
  select?: string;
}
