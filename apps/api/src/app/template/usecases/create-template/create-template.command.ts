import { IsDefined, IsString, IsNumber, IsOptional } from 'class-validator';
import { BaseCommand } from '@shared/commands/base.command';

export class CreateTemplateCommand extends BaseCommand {
  @IsDefined()
  @IsString()
  name: string;

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
