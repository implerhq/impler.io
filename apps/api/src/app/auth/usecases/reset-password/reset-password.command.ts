import { IsDefined, IsString, IsUUID } from 'class-validator';
import { BaseCommand } from '../../../shared/commands/base.command';

export class ResetPasswordCommand extends BaseCommand {
  @IsString()
  @IsDefined()
  password: string;

  @IsUUID(4, {
    message: 'Bad token provided',
  })
  @IsDefined()
  token: string;
}
