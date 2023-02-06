import { IsDefined, IsString, IsEmail } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @IsDefined()
  email: string;

  @IsString()
  @IsDefined()
  password: string;
}
