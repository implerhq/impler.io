import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, IsEmail, IsOptional } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'Email of the user',
  })
  @IsEmail()
  @IsDefined()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
  })
  @IsString()
  @IsDefined()
  password: string;

  @ApiProperty({
    description: 'InvitationId to accept invitation later on',
  })
  @IsString()
  @IsOptional()
  invitationId?: string;
}
