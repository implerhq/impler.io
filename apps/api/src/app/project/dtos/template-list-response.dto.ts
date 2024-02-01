import { IsDefined, IsNumber, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TemplateListResponseDto {
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
    description: 'URL to download samle csv file',
  })
  @IsString()
  @IsDefined()
  sampleFileUrl: string;

  @ApiProperty({
    description: 'Total number of columns in the template',
  })
  @IsDefined()
  @IsNumber()
  totalColumns: number;
}
