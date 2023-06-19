import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail } from 'class-validator';

export class RequestForgotPasswordDto {
  @ApiProperty({
    description: 'Email of the user',
  })
  @IsEmail()
  @IsDefined()
  email: string;
}
