import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, IsEmail, IsOptional, MinLength, MaxLength } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    description: 'First name of the user',
  })
  @IsString()
  @IsDefined()
  @MinLength(1)
  @MaxLength(100)
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
  })
  @IsString()
  @IsDefined()
  @MinLength(1)
  @MaxLength(100)
  lastName: string;

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
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(128)
  password: string;

  @ApiProperty({
    description: 'InvitationId to accept invitation later on',
  })
  @IsString()
  @IsOptional()
  invitationId?: string;
}
