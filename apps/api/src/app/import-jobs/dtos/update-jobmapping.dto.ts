import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateJobMappingDto {
  @IsString()
  key: string;

  @IsString()
  name: string;

  @IsBoolean()
  isRequired: boolean;

  @IsOptional()
  @IsString()
  path: string;

  @IsString()
  jobId: string;
}
