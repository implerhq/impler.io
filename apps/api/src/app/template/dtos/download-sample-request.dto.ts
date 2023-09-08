import { IsOptional, IsArray, IsJSON } from 'class-validator';

export class DownloadSampleDto {
  @IsArray()
  @IsOptional()
  data: Record<string, unknown>[];

  @IsJSON()
  @IsOptional()
  schema?: string;
}
