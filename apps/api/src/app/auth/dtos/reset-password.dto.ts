import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, IsUUID, MaxLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsDefined()
  @MaxLength(70)
  @ApiProperty({
    description: 'New password of the user',
  })
  password: string;

  @IsUUID(4, {
    message: 'Bad token provided',
  })
  @ApiProperty({
    description: 'Token to reset password',
  })
  @IsDefined()
  token: string;
}
