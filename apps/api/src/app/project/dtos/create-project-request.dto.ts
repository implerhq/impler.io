import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsString, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { changeToCode } from '@impler/shared';
import { UniqueValidator } from '@shared/framework/is-unique.validator';

export class CreateProjectRequestDto {
  @ApiProperty({
    description: 'Name of the project',
  })
  @IsString()
  @IsDefined()
  name: string;

  @ApiProperty({
    description: 'Code of the project',
  })
  @IsString()
  @IsDefined()
  @Validate(UniqueValidator, ['Project', 'code'], {
    message: 'Code is already taken',
  })
  @Transform((value) => changeToCode(value.value))
  code: string;

  @ApiPropertyOptional({
    description: 'Name of authentication header to sent along the request',
  })
  @IsString()
  @IsOptional()
  authHeaderName: string;
}
