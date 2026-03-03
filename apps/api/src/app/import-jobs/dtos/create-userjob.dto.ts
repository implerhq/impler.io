import { IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, Matches } from 'class-validator';

export class CreateUserJobDto {
  @IsString()
  @IsNotEmpty()
  webSocketSessionId: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_tld: false }, { message: 'url must be a valid URL' })
  @MaxLength(2048)
  url: string;

  @IsString()
  @IsOptional()
  externalUserId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100000)
  extra?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2048)
  authHeaderValue?: string;

  @IsString()
  @IsOptional()
  @Matches(
    /^(\*|[0-9]|[1-5][0-9])(\/[0-9]+)?\s+(\*|[0-9]|1[0-9]|2[0-3])(\/[0-9]+)?\s+(\*|[1-9]|[12][0-9]|3[01])(\/[0-9]+)?\s+(\*|[1-9]|1[0-2])(\/[0-9]+)?\s+(\*|[0-6])(\/[0-9]+)?$/,
    { message: 'cron must be a valid cron expression' }
  )
  cron?: string;
}
