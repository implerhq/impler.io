import { IsBoolean, IsDefined, IsMongoId } from 'class-validator';
import { BaseCommand } from '@shared/commands/base.command';

export class ConfirmReviewCommand extends BaseCommand {
  @IsDefined()
  @IsMongoId()
  _uploadId: string;

  @IsDefined()
  @IsBoolean()
  processInvalidRecords: boolean;
}
