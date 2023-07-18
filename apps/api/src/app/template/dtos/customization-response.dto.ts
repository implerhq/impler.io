import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsOptional, IsString } from 'class-validator';

export class CustomizationResponseDto {
  @ApiPropertyOptional({
    description: 'Id of the customization',
  })
  @IsString()
  @IsDefined()
  _id?: string;

  @ApiProperty({
    description: 'JSON structure on, How Individual records will be formatted.',
  })
  @IsString()
  @IsOptional()
  recordFormat?: string;

  @ApiProperty({
    description: 'JSON structure on, How chunk will be formatted',
  })
  @IsString()
  @IsOptional()
  chunkFormat?: string;

  @ApiProperty({
    description: 'Combined JSON structure for both record and chunk',
  })
  @IsString()
  @IsOptional()
  combinedFormat?: string;

  @ApiProperty({
    description: 'Flag indicating if record format is updated',
  })
  @IsBoolean()
  @IsDefined()
  isRecordFormatUpdated: boolean;

  @ApiProperty({
    description: 'Flag indicating if chunk format is updated',
  })
  @IsBoolean()
  @IsDefined()
  isChunkFormatUpdated: boolean;
}
