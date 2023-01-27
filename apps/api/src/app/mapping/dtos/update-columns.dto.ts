import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, IsMongoId, IsOptional } from 'class-validator';

export class UpdateMappingDto {
  @ApiProperty({
    description: 'Id of the column',
  })
  @IsMongoId()
  @IsDefined()
  _columnId: string;

  @ApiProperty({
    description: 'Selected Heading for column',
  })
  @IsOptional()
  @IsString()
  columnHeading: string;
}
