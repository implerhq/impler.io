import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsOptional, IsString } from 'class-validator';

export class SendSampleRequestDto {
  @ApiProperty({
    description: 'Auth header value',
    example: 'Bearer your-auth-header-value',
  })
  @IsString()
  @IsOptional()
  authHeaderValue?: string;

  @ApiProperty({
    description: 'Extra data',
    example: 'extra-data',
  })
  @IsJSON()
  @IsOptional()
  extra?: JSON;
}
