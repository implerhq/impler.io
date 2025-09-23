import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SendSampleRequestDto {
  @ApiProperty({
    description: 'Auth header value',
    example: 'auth-header-value',
  })
  @IsString()
  @IsOptional()
  authHeaderValue?: string;

  @ApiProperty({
    description: 'Extra data',
    example: 'extra-data',
  })
  @IsString()
  @IsOptional()
  extra?: string;
}
