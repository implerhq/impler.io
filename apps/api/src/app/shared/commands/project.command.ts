import { IsNotEmpty } from 'class-validator';
import { AuthenticatedCommand } from './authenticated.command';

export abstract class ProjectCommand extends AuthenticatedCommand {
  @IsNotEmpty()
  readonly projectId: string;
}
