import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class ConfirmReviewRequestDto {
  @ApiProperty({
    description: 'Boolean value indicating whether to process the invalid data or not.',
    default: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  processInvalidRecords: boolean;
}
