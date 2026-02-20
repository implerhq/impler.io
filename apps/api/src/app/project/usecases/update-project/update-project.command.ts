import { IsArray, IsOptional, IsString } from 'class-validator';
import { BaseCommand } from '@shared/commands/base.command';

export class UpdateProjectCommand extends BaseCommand {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  authHeaderName: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  authDomains?: string[];
}
