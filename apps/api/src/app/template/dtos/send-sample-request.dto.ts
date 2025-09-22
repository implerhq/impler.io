import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsOptional, IsString } from 'class-validator';

export class SendSampleRequestDto {
  @ApiProperty({
    description: 'Extra data',
    example: 'extra-data',
  })
  @IsJSON()
  @IsString()
  @IsOptional()
  extra?: JSON | string;
}
