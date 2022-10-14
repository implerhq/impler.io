import { IsArray, IsDefined, IsMongoId } from 'class-validator';
import { BaseCommand } from '../../../shared/commands/base.command';

export class DoMappingCommand extends BaseCommand {
  @IsDefined()
  @IsMongoId()
  _uploadId: string;

  @IsDefined()
  @IsMongoId()
  _templateId: string;

  @IsDefined()
  @IsArray()
  headings: string[];
}
