import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, IsOptional } from 'class-validator';

export class UpdateMappingDto {
  @ApiProperty({
    description: 'key of the column',
  })
  @IsDefined()
  key: string;

  @ApiProperty({
    description: 'Name of the column',
  })
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Selected Heading for column',
  })
  @IsOptional()
  @IsString()
  columnHeading: string;
}
