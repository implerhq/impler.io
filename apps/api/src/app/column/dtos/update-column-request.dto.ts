import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDefined,
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  ValidateIf,
  IsNotEmpty,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ColumnTypesEnum, Defaults } from '@impler/shared';
import { IsValidRegex } from '@shared/framework/is-valid-regex.validator';

export class UpdateColumnRequestDto {
  @ApiProperty({
    description: 'Name of the column',
    type: 'string',
  })
  @IsString()
  @IsDefined()
  name: string;

  @ApiProperty({
    description: 'Key of the column',
  })
  @IsString()
  @IsDefined()
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
  @IsBoolean()
  @IsOptional()
  isRequired = false;

  @ApiPropertyOptional({
    description: 'While true, it Indicates column value should be unique in data',
  })
  @IsBoolean()
  @IsOptional()
  isUnique = false;

  @ApiProperty({
    description: 'Specifies the type of column',
    enum: ColumnTypesEnum,
  })
  @IsEnum(ColumnTypesEnum, {
    message: `type must be one of ${Object.values(ColumnTypesEnum).join(', ')}`,
  })
  @IsDefined()
  type: ColumnTypesEnum;

  @ApiPropertyOptional({
    description: 'Regex if type is Regex',
  })
  @ValidateIf((object) => object.type === ColumnTypesEnum.REGEX)
  @Validate(IsValidRegex)
  @IsNotEmpty()
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
  @ValidateIf((object) => object.type === ColumnTypesEnum.SELECT)
  @IsArray()
  @ArrayMinSize(Defaults.ONE)
  @Type(() => Array<string>)
  selectValues: string[];

  @ApiProperty({
    description: 'Sequence of column',
  })
  @IsNumber()
  @IsOptional()
  sequence: number;
}
