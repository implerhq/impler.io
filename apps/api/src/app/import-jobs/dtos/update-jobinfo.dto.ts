import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateJobInfoDto {
  @IsString()
  @IsOptional()
  url: string;

  @IsString()
  @IsOptional()
  _templateId: string;

  @IsString()
  @IsOptional()
  cron: string;

  @IsArray()
  @IsOptional()
  headings: string[];

  @IsString()
  @IsOptional()
  status: string;

  @IsString()
  @IsOptional()
  externalUserId: string;
}
