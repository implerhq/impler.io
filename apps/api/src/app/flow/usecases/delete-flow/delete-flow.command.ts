import { IsDefined, IsMongoId } from 'class-validator';
import { AuthenticatedCommand } from '@shared/commands/authenticated.command';

export class DeleteFlowCommand extends AuthenticatedCommand {
  @IsMongoId()
  @IsDefined()
  _flowId: string;
}
