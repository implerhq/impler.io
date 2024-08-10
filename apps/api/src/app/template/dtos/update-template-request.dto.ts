import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

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
}
