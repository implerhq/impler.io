import { IsArray, IsDateString, IsOptional, IsString, IsUrl, MaxLength, Matches } from 'class-validator';

export class UpdateJobDto {
  @IsString()
  @IsOptional()
  @IsUrl({ require_tld: false }, { message: 'url must be a valid URL' })
  @MaxLength(2048)
  url: string;

  @IsString()
  @IsOptional()
  _templateId: string;

  @IsString()
  @IsOptional()
  @Matches(
    /^(\*|[0-9]|[1-5][0-9])(\/[0-9]+)?\s+(\*|[0-9]|1[0-9]|2[0-3])(\/[0-9]+)?\s+(\*|[1-9]|[12][0-9]|3[01])(\/[0-9]+)?\s+(\*|[1-9]|1[0-2])(\/[0-9]+)?\s+(\*|[0-6])(\/[0-9]+)?$/,
    { message: 'cron must be a valid cron expression' }
  )
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
