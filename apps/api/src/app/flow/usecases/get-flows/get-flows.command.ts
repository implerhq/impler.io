import { AuthenticatedCommand } from '@shared/commands/authenticated.command';
import { IsNumber, IsOptional } from 'class-validator';

export class GetFlowsCommand extends AuthenticatedCommand {
  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsNumber()
  @IsOptional()
  offset?: number;
}
