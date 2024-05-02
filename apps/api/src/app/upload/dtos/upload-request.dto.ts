import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsOptional, IsString } from 'class-validator';

export class UploadRequestDto {
  @ApiProperty({
    type: 'file',
    required: true,
  })
  file: Express.Multer.File;

  @ApiProperty({
    description: 'Auth header value to send during webhook call',
    required: false,
  })
  @IsOptional()
  @IsString()
  authHeaderValue: string;

  @ApiProperty({
    description: 'Custom schema if wants to override default schema',
    required: false,
  })
  @IsOptional()
  @IsJSON()
  schema: string;

  @ApiProperty({
    description: 'Custom output if wants to modify how schema values are sent',
    required: false,
  })
  @IsOptional()
  @IsJSON()
  output: string;

  @ApiProperty({
    description: 'Payload to send during webhook call',
    required: false,
  })
  @IsOptional()
  @IsJSON()
  extra: string;

  @ApiProperty({
    description: 'Name of the excel sheet to Import',
  })
  @IsOptional()
  @IsString()
  selectedSheetName: string;
}
