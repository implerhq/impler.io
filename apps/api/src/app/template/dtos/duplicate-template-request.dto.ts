import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, IsOptional, IsBoolean } from 'class-validator';

export class DuplicateTemplateRequestDto {
  @ApiProperty({
    description: 'Name of the template',
  })
  @IsDefined()
  @IsString()
  name: string;

  @ApiProperty({
    description: '_projectId where the template will be created',
  })
  @IsString()
  @IsDefined()
  _projectId: string;

  @ApiProperty({
    description: 'Whether to duplicate columns?',
  })
  @IsBoolean()
  @IsOptional()
  duplicateColumns?: boolean;

  @ApiProperty({
    description: 'Whether to duplicate output?',
  })
  @IsBoolean()
  @IsOptional()
  duplicateOutput?: boolean;

  @ApiProperty({
    description: 'Whether to duplicate webhook?',
  })
  @IsBoolean()
  @IsOptional()
  duplicateWebhook?: boolean;

  @ApiProperty({
    description: 'Whether to duplicate validation code?',
  })
  @IsBoolean()
  @IsOptional()
  duplicateValidator?: boolean;
}
