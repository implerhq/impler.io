import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsString } from 'class-validator';

export class UpdateValidationResponseDto {
  @ApiPropertyOptional({
    description: 'Whether code is passed testing',
  })
  @IsBoolean()
  @IsDefined()
  passed?: boolean;

  @ApiProperty({
    description: 'Output of the code execution',
  })
  @IsString()
  @IsDefined()
  standardOutput: string;

  @ApiProperty({
    description: 'Error of code execution',
  })
  @IsString()
  @IsDefined()
  standardError?: string;
}
