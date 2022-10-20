import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class PaginationResponseDto {
  @ApiProperty({
    description: 'Page index of the data',
  })
  @IsNumber()
  page: number;

  @ApiProperty({
    description: 'Array of data',
  })
  @IsArray()
  data: any[];

  @ApiProperty({
    description: 'Size of the data',
  })
  @IsNumber()
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
  })
  @IsNumber()
  totalPages: number;

  @ApiProperty({
    description: 'Total number of records',
  })
  @IsNumber()
  totalRecords: number;
}
