import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateJobMappingDto {
  @IsString()
  key: string;

  @IsString()
  name: string;

  @IsBoolean()
  isRequired: boolean;

  @IsString()
  @IsOptional()
  path?: string;

  @IsString()
  _jobId: string;
}
