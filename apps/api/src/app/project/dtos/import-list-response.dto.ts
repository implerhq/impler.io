import { IsDefined, IsNumber, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ImportListResponseDto {
  @ApiPropertyOptional({
    description: 'Id of the import',
  })
  @IsString()
  @IsDefined()
  _id?: string;

  @ApiProperty({
    description: 'Name of the import',
  })
  @IsString()
  @IsDefined()
  name: string;

  @ApiProperty({
    description: 'Total number of uploads',
  })
  @IsNumber()
  @IsDefined()
  totalUploads: number;

  @ApiProperty({
    description: 'Total number of records imported',
  })
  @IsNumber()
  @IsDefined()
  totalRecords: number;

  @ApiProperty({
    description: 'Total number of invalid records',
  })
  @IsNumber()
  @IsDefined()
  totalInvalidRecords: number;
}
