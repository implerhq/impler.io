import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsOptional, IsString } from 'class-validator';

export class UploadRequestDto {
  @ApiProperty({
    type: 'file',
    required: true,
  })
  file: Express.Multer.File;

  @ApiProperty({
    description: 'Auth header value to send during webhook call',
    required: false,
  })
  @IsOptional()
  @IsString()
  authHeaderValue: string;

  @ApiProperty({
    description: 'Payload to send during webhook call',
    required: false,
  })
  @IsOptional()
  @IsJSON()
  extra: string;
}
