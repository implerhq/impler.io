import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';

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

  @IsDate()
  @IsOptional()
  createdOn: Date;
}
