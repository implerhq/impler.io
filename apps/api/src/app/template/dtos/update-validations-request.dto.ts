import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateValidationsRequestDto {
  @ApiProperty({
    description: 'On Batch Initialize of the validations record',
  })
  @IsString()
  @IsOptional()
  onBatchInitialize?: string;
}
