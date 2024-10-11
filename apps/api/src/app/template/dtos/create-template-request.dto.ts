import { ApiProperty } from '@nestjs/swagger';
import { Defaults, IntegrationEnum } from '@impler/shared';
import { IsDefined, IsString, IsNumber, IsUrl, IsOptional, IsMongoId, IsEnum } from 'class-validator';

export class CreateTemplateRequestDto {
  @ApiProperty({
    description: 'Name of the template',
  })
  @IsString()
  @IsDefined()
  name: string;

  @ApiProperty({
    description: 'Where do the user wanted to integrate the import',
  })
  @IsEnum(IntegrationEnum)
  @IsOptional()
  @IsDefined()
  integration: IntegrationEnum;

  @ApiProperty({
    description: 'Callback URL of the template, gets called when sending data to the application',
  })
  @IsUrl()
  @IsOptional()
  callbackUrl?: string;

  @ApiProperty({
    description: 'Size of data in rows that gets sent to the application',
    default: Defaults.CHUNK_SIZE,
  })
  @IsNumber()
  @IsOptional()
  chunkSize?: number = Defaults.CHUNK_SIZE;

  @ApiProperty({
    description: 'Id of the project',
  })
  @IsMongoId()
  _projectId: string;
}
