import { IsDefined, IsMongoId, IsOptional, IsString } from 'class-validator';
import { BaseCommand } from '../../../shared/commands/base.command';

export class GetUploadsCommand extends BaseCommand {
  @IsDefined()
  @IsMongoId()
  _templateId: string;

  @IsOptional()
  @IsString()
  select?: string;
}
