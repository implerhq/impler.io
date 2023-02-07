import { IsDefined, IsString } from 'class-validator';
import { BaseCommand } from '@shared/commands/base.command';

export class AddMemberCommand extends BaseCommand {
  @IsDefined()
  @IsString()
  _userId: string;

  @IsDefined()
  @IsString()
  _projectId: string;
}
