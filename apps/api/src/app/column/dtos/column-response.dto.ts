import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ColumnTypesEnum } from '@impler/shared';

export class ColumnResponseDto {
  @ApiProperty({
    description: 'Name of the column',
    type: 'string',
  })
  name: string;

  @ApiProperty({
    description: 'Key of the column',
  })
  key: string;

  @ApiProperty({
    description: 'Alternative possible keys of the column',
    type: Array<string>,
  })
  alternateKeys?: string[];

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
  regex?: string;

  @ApiPropertyOptional({
    description: 'Description of Regex',
  })
  regexDescription?: string;

  @ApiPropertyOptional({
    description: 'List of possible values for column if type is Select',
  })
  selectValues?: string[];

  @ApiPropertyOptional({
    description: 'List of possible date formats for column if type is Date',
  })
  dateFormats?: string[];

  @ApiProperty({
    description: 'Sequence of column',
  })
  sequence?: number;

  @ApiProperty({
    description: 'If true, the column can have multiple values',
  })
  allowMultiSelect?: boolean;
}
