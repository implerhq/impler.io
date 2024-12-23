import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateJobDto {
  @IsString()
  @IsOptional()
  url: string;

  @IsString()
  @IsOptional()
  _templateId: string;

  @IsString()
  @IsOptional()
  cron: string;

  @IsDateString()
  @IsOptional()
  endsOn?: Date;

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
