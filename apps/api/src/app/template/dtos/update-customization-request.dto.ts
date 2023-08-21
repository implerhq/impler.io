import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCustomizationRequestDto {
  @ApiProperty({
    description: 'Format for individual records',
    nullable: false,
  })
  @IsOptional()
  @IsString()
  recordFormat?: string;

  @ApiProperty({
    description: 'Format for chunk of records',
    nullable: false,
  })
  @IsOptional()
  @IsString()
  chunkFormat: string;

  @ApiProperty({
    description: 'Combined JSON structure for both record and chunk',
  })
  @IsString()
  @IsOptional()
  combinedFormat?: string;
}
