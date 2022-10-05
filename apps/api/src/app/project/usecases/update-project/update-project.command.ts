import { IsOptional, IsString } from 'class-validator';
import { BaseCommand } from '../../../shared/commands/base.command';

export class UpdateProjectCommand extends BaseCommand {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  authHeaderName: string;
}
