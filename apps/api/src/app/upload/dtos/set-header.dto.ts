import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class SetHeaderDto {
  @ApiProperty({
    description: 'Index of the header row',
  })
  @IsOptional()
  @IsNumber()
  index?: number;

  @ApiProperty({
    description: 'Headings of the header row',
    type: [String],
  })
  @IsArray()
  headings: string[];
}
