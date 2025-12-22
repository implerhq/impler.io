import { IntegrationEnum } from '@impler/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateTemplateRequestDto {
  @ApiProperty({
    description: 'Name of the template',
    nullable: false,
  })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Import Mode of the template',
    nullable: false,
  })
  @IsOptional()
  mode?: string;

  @ApiProperty({
    description: 'Update Where do the user wanted to integrate the import',
    nullable: true,
  })
  @IsOptional()
  @IsEnum(IntegrationEnum)
  integration?: IntegrationEnum;

  @ApiProperty({
    description: 'Expected Date Format',
    nullable: true,
  })
  @IsOptional()
  expectedDateFormat?: string;
}
