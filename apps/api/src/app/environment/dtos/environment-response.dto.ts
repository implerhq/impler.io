import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDefined, IsString, ValidateNested } from 'class-validator';
import { ApiKey } from './api-key.dto';

export class EnvironmentResponseDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  public _id: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  public _projectId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApiKey)
  public apiKeys: ApiKey[];
}
