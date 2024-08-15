import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Email of the user',
  })
  @IsEmail()
  @IsOptional()
  email?: string;
}
