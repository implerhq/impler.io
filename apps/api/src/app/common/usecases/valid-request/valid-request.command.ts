import { IsDefined, IsMongoId, IsOptional, IsString } from 'class-validator';
import { BaseCommand } from '@shared/commands/base.command';

export class ValidRequestCommand extends BaseCommand {
  @IsMongoId()
  @IsDefined()
  projectId: string;

  @IsString()
  @IsOptional()
  template: string;
}
