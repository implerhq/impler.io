import { IsString, IsOptional, IsMongoId, IsEnum } from 'class-validator';
import { BaseCommand } from '@shared/commands/base.command';
import { IntegrationEnum } from '@impler/shared';

export class UpdateTemplateCommand extends BaseCommand {
  @IsString()
  @IsOptional()
  name?: string;

  @IsMongoId({
    message: '_projectId is not valid',
  })
  @IsOptional()
  _projectId?: string;

  @IsString()
  @IsOptional()
  mode?: string;

  @IsEnum(IntegrationEnum)
  @IsOptional()
  integration?: IntegrationEnum;
}
