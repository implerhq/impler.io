import { IsDefined, IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { BaseCommand } from '@shared/commands/base.command';
import { IntegrationEnum } from '@impler/shared';

export class CreateTemplateCommand extends BaseCommand {
  @IsDefined()
  @IsString()
  name: string;

  @IsOptional()
  @IsOptional()
  @IsEnum(IntegrationEnum)
  integration: IntegrationEnum;

  @IsString()
  @IsOptional()
  callbackUrl?: string;

  @IsNumber()
  @IsDefined()
  chunkSize: number;

  @IsString()
  @IsDefined()
  _projectId: string;
}
