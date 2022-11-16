import { IsDefined, IsString, IsNumber } from 'class-validator';
import { BaseCommand } from '../../../shared/commands/base.command';

export class CreateTemplateCommand extends BaseCommand {
  @IsDefined()
  @IsString()
  name: string;

  @IsDefined()
  @IsString()
  code: string;

  @IsString()
  @IsDefined()
  callbackUrl: string;

  @IsNumber()
  @IsDefined()
  chunkSize: number;

  @IsString()
  @IsDefined()
  _projectId: string;
}
