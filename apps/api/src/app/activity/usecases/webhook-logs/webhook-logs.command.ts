import { IsDefined, IsMongoId, IsOptional, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class WebhookLogsCommand {
  @IsDefined()
  @IsMongoId()
  uploadId: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  isRetry?: boolean;
}
