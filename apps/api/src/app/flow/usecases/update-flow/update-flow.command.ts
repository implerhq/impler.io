import { AuthenticatedCommand } from '@shared/commands/authenticated.command';
import { IsDefined, IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateFlowCommand extends AuthenticatedCommand {
  @IsMongoId()
  @IsDefined()
  _flowId: string;

  @IsString()
  @IsOptional()
  name?: string;
}
