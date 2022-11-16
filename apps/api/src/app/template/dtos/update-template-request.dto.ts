import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsNotEmpty, IsUrl } from 'class-validator';

export class UpdateTemplateRequestDto {
  @ApiProperty({
    description: 'Name of the template',
    nullable: false,
  })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Callback URL of the template, gets called when sending data to the application',
    nullable: false,
  })
  @IsUrl()
  @IsOptional()
  callbackUrl?: string;

  @ApiProperty({
    description: 'Size of data in rows that gets sent to the application',
    format: 'number',
    nullable: false,
  })
  @IsNumber({
    allowNaN: false,
  })
  @IsOptional()
  @IsNotEmpty()
  chunkSize?: number;

  @ApiProperty({
    description: 'Id of project related to the template',
    nullable: false,
  })
  @IsString()
  @IsOptional()
  _projectId?: string;
}
