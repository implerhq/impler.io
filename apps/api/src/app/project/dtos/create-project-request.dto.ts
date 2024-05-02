import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsOptional, IsString } from 'class-validator';
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

  @ApiPropertyOptional({
    description: 'Is this project created during onboarding?',
  })
  @IsBoolean()
  @IsOptional()
  onboarding = false;
}
