import { IntegrationEnum } from '@impler/shared';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class TemplateResponseDto {
  @ApiPropertyOptional({
    description: 'Id of the template',
  })
  @IsString()
  @IsDefined()
  _id?: string;

  @ApiProperty({
    description: 'Name of the template',
  })
  @IsString()
  @IsDefined()
  name: string;

  @ApiProperty({
    description: 'Where do the user wanted to integrate the import',
  })
  @IsOptional()
  @IsEnum(IntegrationEnum)
  @IsDefined()
  integration: IntegrationEnum;

  @ApiProperty({
    description: 'URL to download samle csv file',
  })
  @IsString()
  @IsDefined()
  sampleFileUrl: string;

  @ApiProperty({
    description: 'Id of project related to the template',
  })
  @IsString()
  @IsDefined()
  _projectId: string;

  @ApiProperty({
    description: 'Total number of imports',
  })
  @IsNumber()
  @IsDefined()
  totalUploads: number;

  @ApiProperty({
    description: 'Total number of imported records',
  })
  @IsNumber()
  @IsDefined()
  totalRecords: number;

  @ApiProperty({
    description: 'Total number of invalid records',
  })
  @IsNumber()
  @IsDefined()
  totalInvalidRecords: number;

  @ApiProperty({
    description: 'Import Mode',
  })
  @IsString()
  @IsDefined()
  mode: string;
}
