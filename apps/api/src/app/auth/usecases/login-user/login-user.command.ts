import { IsDefined, IsString, IsEmail } from 'class-validator';
import { BaseCommand } from '@shared/commands/base.command';

export class LoginUserCommand extends BaseCommand {
  @IsEmail()
  @IsDefined()
  email: string;

  @IsString()
  @IsDefined()
  password: string;
}
