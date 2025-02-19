import { IsDefined, IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { BaseCommand } from '@shared/commands/base.command';
import { IColumn, IntegrationEnum } from '@impler/shared';

export class CreateTemplateCommand extends BaseCommand {
  @IsDefined()
  @IsString()
  name: string;

  @IsOptional()
  @IsOptional()
  @IsEnum(IntegrationEnum)
  importIntegration: IntegrationEnum;

  @IsString()
  @IsOptional()
  callbackUrl?: string;

  @IsNumber()
  @IsDefined()
  chunkSize: number;

  @IsString()
  @IsDefined()
  _projectId: string;

  @IsOptional()
  columns?: IColumn[];
}
