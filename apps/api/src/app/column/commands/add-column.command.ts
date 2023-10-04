import { IsArray, IsBoolean, IsDefined, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ColumnTypesEnum } from '@impler/shared';
import { BaseCommand } from '@shared/commands/base.command';

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
  alternateKeys: string[];

  @IsBoolean()
  @IsOptional()
  isRequired = false;

  @IsBoolean()
  @IsOptional()
  isUnique = false;

  @IsDefined()
  type: ColumnTypesEnum;

  @IsString()
  @IsOptional()
  regex: string;

  @IsString()
  @IsOptional()
  regexDescription: string;

  @IsArray()
  @IsOptional()
  @Type(() => Array<string>)
  selectValues: string[];

  @IsArray()
  @IsOptional()
  @Type(() => Array<string>)
  dateFormats: string[];

  @IsNumber()
  @IsOptional()
  sequence: number;

  @IsDefined()
  @IsMongoId()
  _templateId: string;
}
