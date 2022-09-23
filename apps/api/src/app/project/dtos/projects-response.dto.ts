import { ApiProperty } from '@nestjs/swagger';

export class ProjectResponseDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  code: string;
}
