import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsString } from 'class-validator';

export class ValidationsResponseDto {
  @ApiPropertyOptional({
    description: 'Id of the validations record',
  })
  @IsString()
  @IsDefined()
  _id?: string;

  @ApiProperty({
    description: 'Template Id of the validations record',
  })
  @IsString()
  @IsDefined()
  _templateId: string;

  @ApiProperty({
    description: 'On Batch Initialize of the validations record',
  })
  @IsString()
  @IsOptional()
  onBatchInitialize?: string;
}
