import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

export class DeleteRecordsDto {
  @ApiProperty({
    description: 'Records indexes to delete',
  })
  @IsDefined()
  indexes: number[];

  @ApiProperty({
    description: 'Valid records count',
  })
  @IsDefined()
  valid: number;

  @ApiProperty({
    description: 'Invalid records count',
  })
  @IsDefined()
  invalid: number;
}
