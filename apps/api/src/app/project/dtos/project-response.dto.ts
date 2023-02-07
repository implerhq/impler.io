import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsString } from 'class-validator';

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
    description: 'Name of authentication header to sent along the request',
  })
  @IsString()
  @IsOptional()
  authHeaderName?: string;
}
