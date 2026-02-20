import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateProjectRequestDto {
  @ApiPropertyOptional({
    description: 'Name of the project',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({
    description: 'Name of authentication header to sent along the request',
  })
  @IsString()
  @IsOptional()
  authHeaderName: string;

  @ApiPropertyOptional({
    description: 'List of allowed domains for the project',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  authDomains?: string[];
}
