import { IsDefined, IsString } from 'class-validator';
import { BaseCommand } from '../../../shared/commands/base.command';

export class CreateProjectCommand extends BaseCommand {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  code: string;
}
