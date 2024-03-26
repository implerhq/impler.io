import { IsBoolean, IsDefined, IsOptional, IsString } from 'class-validator';
import { BaseCommand } from '@shared/commands/base.command';

export class DuplicateTemplateCommand extends BaseCommand {
  @IsDefined()
  @IsString()
  name: string;

  @IsString()
  @IsDefined()
  _projectId: string;

  @IsBoolean()
  @IsOptional()
  duplicateColumns?: boolean;

  @IsBoolean()
  @IsOptional()
  duplicateOutput?: boolean;

  @IsBoolean()
  @IsOptional()
  duplicateDestination?: boolean;

  @IsBoolean()
  @IsOptional()
  duplicateValidator?: boolean;
}
