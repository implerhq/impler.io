import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

export class UpdateCellDto {
  @ApiProperty({
    description: 'Record index',
  })
  @IsDefined()
  index: number;

  @ApiProperty({
    description: 'Record values to update',
  })
  @IsDefined()
  record: Record<string, any>;

  @ApiProperty({
    description: 'Update value flags',
  })
  @IsDefined()
  updated: Record<string, boolean>;
}
