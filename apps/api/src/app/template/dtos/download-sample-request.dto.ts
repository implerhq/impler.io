import { IsOptional, IsArray } from 'class-validator';

export class DownloadSampleDto {
  @IsArray()
  @IsOptional()
  data: Record<string, unknown>[];

  @IsArray()
  @IsOptional()
  schema: Record<string, unknown>[];
}
