import { IsString, IsDefined, IsMongoId } from 'class-validator';
import { BaseCommand } from '@shared/commands/base.command';

export class ValidateMappingCommand extends BaseCommand {
  @IsDefined()
  @IsMongoId()
  _columnId: string;

  @IsDefined()
  @IsString()
  columnHeading: string;
}
