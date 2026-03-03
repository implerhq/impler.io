import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, IsEmail, IsOptional, MinLength, MaxLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'Email of the user',
  })
  @IsEmail()
  @IsDefined()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    description: 'Password of the user',
  })
  @IsString()
  @IsDefined()
  @MinLength(1)
  @MaxLength(128)
  password: string;

  @ApiProperty({
    description: 'InvitationId to accept invitation later on',
  })
  @IsString()
  @IsOptional()
  invitationId?: string;
}
