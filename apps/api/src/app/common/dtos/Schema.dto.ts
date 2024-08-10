import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  ValidateIf,
  IsNotEmpty,
  Validate,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ColumnTypesEnum, Defaults } from '@impler/shared';
import { IsValidRegex } from '@shared/framework/is-valid-regex.validator';

export class SchemaDto {
  @ApiProperty({
    description: 'Name of the column',
    type: 'string',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Key of the column',
  })
  @IsNotEmpty({ message: "'key' should not empty" })
  @IsString({ message: "'key' must be a string" })
  key: string;

  @ApiProperty({
    description: 'Alternative possible keys of the column',
    type: Array<string>,
  })
  @IsArray()
  @IsOptional()
  @Type(() => Array<string>)
  alternateKeys: string[];

  @ApiPropertyOptional({
    description: 'While true, it Indicates column value should exists in data',
  })
  @IsBoolean({ message: "'isRequired' must be boolean" })
  @IsOptional()
  isRequired = false;

  @ApiPropertyOptional({
    description: 'While true, it Indicates column value should be unique in data',
  })
  @IsBoolean({ message: "'isUnique' must be boolean" })
  @IsOptional()
  isUnique = false;

  @ApiProperty({
    description: 'Specifies the type of column',
    enum: ColumnTypesEnum,
  })
  @IsEnum(ColumnTypesEnum, {
    message: `entered type must be one of ${Object.values(ColumnTypesEnum).join(', ')}`,
  })
  @IsOptional()
  type: ColumnTypesEnum = ColumnTypesEnum.STRING;

  @ApiPropertyOptional({
    description: 'Regex if type is Regex',
  })
  @Validate(IsValidRegex, {
    message: 'Invalid regex pattern',
  })
  @IsNotEmpty({
    message: "'regex' should not empty, when type is Regex",
  })
  @ValidateIf((object) => object.type === ColumnTypesEnum.REGEX)
  regex: string;

  @ApiPropertyOptional({
    description: 'Description of Regex',
  })
  @ValidateIf((object) => object.type === ColumnTypesEnum.REGEX)
  @IsString()
  @IsOptional()
  regexDescription: string;

  @ApiPropertyOptional({
    description: 'List of possible values for column if type is Select',
  })
  @Type(() => Array)
  @IsOptional()
  selectValues: string[] = [];

  @ApiPropertyOptional({
    description: 'List of date formats for column if type is Date',
  })
  @ValidateIf((object) => object.type === ColumnTypesEnum.DATE, {
    message: "'dateFormats' should not empty, when type is Date",
  })
  @Type(() => Array<string>)
  @IsArray({ message: "'dateFormats' must be an array, when type is Date" })
  @ArrayMinSize(1, { message: "'dateFormats' must not be empty, when type is Date" })
  dateFormats: string[] = Defaults.DATE_FORMATS;

  @ApiProperty({
    description: 'Sequence of column',
  })
  @IsNumber()
  @IsOptional()
  sequence: number;
}
