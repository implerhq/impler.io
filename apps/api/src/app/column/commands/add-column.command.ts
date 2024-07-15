import { IsArray, IsBoolean, IsDefined, IsMongoId, IsNumber, IsOptional, IsString, Validate } from 'class-validator';
import { Type } from 'class-transformer';
import { ColumnDelimiterEnum, ColumnTypesEnum } from '@impler/shared';
import { BaseCommand } from '@shared/commands/base.command';
import { IsNumberOrString } from '@shared/framework/number-or-string.validator';

export class AddColumnCommand extends BaseCommand {
  @IsString()
  @IsDefined()
  name: string;

  @IsString()
  @IsDefined()
  key: string;

  @IsArray()
  @IsOptional()
  @Type(() => Array<string>)
  alternateKeys? = [];

  @IsBoolean()
  @IsOptional()
  isRequired? = false;

  @IsBoolean()
  @IsOptional()
  isUnique? = false;

  @IsBoolean()
  @IsOptional()
  isFrozen? = false;

  @IsDefined()
  type: ColumnTypesEnum;

  @IsString()
  @IsOptional()
  regex?: string;

  @IsString()
  @IsOptional()
  regexDescription?: string;

  @IsArray()
  @IsOptional()
  @Type(() => Array<string>)
  selectValues?: string[];

  @IsArray()
  @IsOptional()
  @Type(() => Array<string>)
  dateFormats?: string[];

  @IsNumber()
  @IsOptional()
  sequence?: number;

  @IsDefined()
  @IsMongoId()
  _templateId: string;

  @IsOptional()
  @Validate(IsNumberOrString)
  defaultValue?: string | number;

  @IsBoolean()
  @IsOptional()
  allowMultiSelect?: boolean;

  @IsOptional()
  delimiter?: ColumnDelimiterEnum;
}
