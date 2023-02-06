import { IsEmail, IsDefined, IsString } from 'class-validator';
import { BaseCommand } from '@shared/commands/base.command';

export class RegisterUserCommand extends BaseCommand {
  @IsString()
  @IsDefined()
  firstName: string;

  @IsString()
  @IsDefined()
  lastName: string;

  @IsEmail()
  @IsDefined()
  email: string;

  @IsString()
  @IsDefined()
  password: string;
}
