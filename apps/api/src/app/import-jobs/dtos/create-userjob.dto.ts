import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserJobDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  _templateId: string;

  @IsString()
  @IsOptional()
  externalUserId?: string;

  @IsString()
  @IsOptional()
  extra?: string;
}
