import { IsString, IsDefined } from 'class-validator';
import { BaseCommand } from '@shared/commands/base.command';

export class ValidateMappingCommand extends BaseCommand {
  @IsDefined()
  @IsString()
  key: string;

  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  columnHeading: string;
}
