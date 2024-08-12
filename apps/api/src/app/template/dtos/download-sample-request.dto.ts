import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsJSON } from 'class-validator';

export class DownloadSampleDto {
  @IsJSON()
  @IsOptional()
  data?: string;

  @IsJSON()
  @IsOptional()
  schema?: string;

  @ApiProperty({
    type: 'file',
    required: false,
  })
  file: Express.Multer.File;

  @ApiProperty({
    type: 'string',
    required: false,
  })
  @IsOptional()
  importId: string;

  @IsJSON()
  @IsOptional()
  imageSchema?: string;
}
