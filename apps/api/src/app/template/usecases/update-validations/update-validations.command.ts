import { IsString, IsDefined } from 'class-validator';
import { BaseCommand } from '@shared/commands/base.command';

export class UpdateValidationsCommand extends BaseCommand {
  @IsString()
  @IsDefined()
  onBatchInitialize?: string;
}
