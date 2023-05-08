import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCustomizationRequestDto {
  @ApiProperty({
    description: 'Format for individual records',
    nullable: false,
  })
  @IsString()
  recordFormat: string;

  @ApiProperty({
    description: 'Format for chunk of records',
    nullable: false,
  })
  @IsString()
  chunkFormat: string;
}
