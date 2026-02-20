import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDefined, IsOptional, IsString } from 'class-validator';

export class ProjectResponseDto {
  @ApiPropertyOptional({
    description: 'Id of the project',
  })
  @IsString()
  @IsDefined()
  _id?: string;

  @ApiProperty({
    description: 'Name of the project',
  })
  @IsString()
  @IsDefined()
  name: string;

  @ApiPropertyOptional({
    description: 'List of allowed domains for the project',
  })
  @IsArray()
  @IsOptional()
  authDomains?: string[];
}
