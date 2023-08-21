import { IsDefined, IsString } from 'class-validator';
import { AuthenticatedCommand } from '@shared/commands/authenticated.command';

export class CreateProjectCommand extends AuthenticatedCommand {
  @IsDefined()
  @IsString()
  name: string;
}
