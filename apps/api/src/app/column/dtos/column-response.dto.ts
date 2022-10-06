import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ColumnTypesEnum } from '@impler/shared';

export class ColumnResponseDto {
  @ApiProperty({
    description: 'Name of the column',
    type: 'string',
  })
  name: string;

  @ApiProperty({
    description: 'Possible keys to consider for column',
    type: Array<string>,
  })
  columnKeys: string[];

  @ApiPropertyOptional({
    description: 'While true, it Indicates column value should exists in data',
  })
  isRequired = false;

  @ApiPropertyOptional({
    description: 'While true, it Indicates column value should be unique in data',
  })
  isUnique = false;

  @ApiProperty({
    description: 'Specifies the type of column',
    enum: ColumnTypesEnum,
  })
  type: string;

  @ApiPropertyOptional({
    description: 'Regex if type is Regex',
  })
  regex: string;

  @ApiPropertyOptional({
    description: 'Description of Regex',
  })
  regexDescription: string;

  @ApiPropertyOptional({
    description: 'List of possible values for column if type is Select',
  })
  selectValues: string[];

  @ApiProperty({
    description: 'Sequence of column',
  })
  sequence: number;
}
