import { IsDefined, IsString } from 'class-validator';
import { BaseCommand } from '../../../shared/commands/base.command';

export class UpdateProjectCommand extends BaseCommand {
  @IsDefined()
  @IsString()
  name: string;
}
