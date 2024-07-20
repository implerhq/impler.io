import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateJobMappingDto {
  @IsString()
  @IsOptional()
  key: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsBoolean()
  isRequired: boolean;

  @IsOptional()
  @IsString()
  path: string;

  @IsString()
  _jobId: string;
}
