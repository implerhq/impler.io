import { Defaults } from '@impler/shared';
import { IsString, IsNumber, IsOptional, IsNotEmpty, IsMongoId, Min } from 'class-validator';
import { BaseCommand } from '@shared/commands/base.command';

export class UpdateTemplateCommand extends BaseCommand {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  callbackUrl?: string;

  @IsString()
  @IsOptional()
  authHeaderName?: string;

  @IsNumber({
    allowNaN: false,
  })
  @IsOptional()
  @IsNotEmpty()
  @Min(Defaults.ONE)
  chunkSize?: number;

  @IsMongoId({
    message: '_projectId is not valid',
  })
  @IsOptional()
  _projectId?: string;
}
