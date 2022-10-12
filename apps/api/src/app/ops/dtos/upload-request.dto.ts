import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsOptional, IsString, Validate } from 'class-validator';
import { IsValidTemplateValidator } from '../../shared/framework/is-valid-template.validator';

export class UploadRequestDto {
  @ApiProperty({
    description: 'Id or CODE of the template',
  })
  @IsString()
  @Validate(IsValidTemplateValidator)
  template: string;

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
    description: 'Payload to send during webhook call',
    required: false,
  })
  @IsOptional()
  @IsJSON()
  extra: string;
}
