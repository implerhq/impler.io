import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, IsJSON } from 'class-validator';

export class DownloadSampleDto {
  @IsArray()
  @IsOptional()
  data: Record<string, unknown>[];

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
