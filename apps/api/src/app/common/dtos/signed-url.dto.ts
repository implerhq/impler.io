import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class SignedUrlDto {
  @ApiProperty({
    description: 'Key of the file',
  })
  @IsString()
  @IsDefined()
  key: string;
}
