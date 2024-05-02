import { IsDefined } from 'class-validator';
import { BaseCommand } from '@shared/commands/base.command';

export class GetSheetNamesCommand extends BaseCommand {
  @IsDefined()
  file: Express.Multer.File;
}
