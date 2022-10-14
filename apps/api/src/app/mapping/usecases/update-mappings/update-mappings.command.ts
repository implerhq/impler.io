import { IsString, IsDefined, IsMongoId } from 'class-validator';
import { BaseCommand } from '../../../shared/commands/base.command';

export class UpdateMappingCommand extends BaseCommand {
  @IsDefined()
  @IsMongoId()
  _columnId: string;

  @IsDefined()
  @IsMongoId()
  _uploadId: string;

  @IsDefined()
  @IsString()
  columnHeading: string;
}
