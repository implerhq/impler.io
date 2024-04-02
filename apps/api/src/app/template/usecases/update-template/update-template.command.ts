import { IsString, IsOptional, IsMongoId } from 'class-validator';
import { BaseCommand } from '@shared/commands/base.command';

export class UpdateTemplateCommand extends BaseCommand {
  @IsString()
  @IsOptional()
  name?: string;

  @IsMongoId({
    message: '_projectId is not valid',
  })
  @IsOptional()
  _projectId?: string;
}
