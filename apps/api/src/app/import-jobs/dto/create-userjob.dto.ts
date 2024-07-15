import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDefined, IsString, IsUrl } from 'class-validator';

export class CreateUserJobDto {
  @ApiProperty({
    description: 'RSS URL from where the data should be imported',
  })
  @IsUrl()
  @IsDefined()
  url: string;

  @ApiProperty({
    description: 'Headings array is to be gotten when the RSS URL is valid and properly parsed',
  })
  @IsArray()
  @IsDefined()
  headings: string[];

  @IsDefined()
  @IsString()
  _templateId: string;
}
