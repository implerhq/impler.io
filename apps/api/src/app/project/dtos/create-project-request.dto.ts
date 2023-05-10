import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsString } from 'class-validator';
export class CreateProjectRequestDto {
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
  authHeaderName: string;
}
