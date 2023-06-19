import { BaseCommand } from '@shared/commands/base.command';
import { IsDefined, IsEmail } from 'class-validator';

export class RequestForgotPasswordCommand extends BaseCommand {
  @IsEmail()
  @IsDefined()
  email: string;
}
