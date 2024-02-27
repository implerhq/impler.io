import { ApiProperty } from '@nestjs/swagger';

export class SheetNamesDto {
  @ApiProperty({
    type: 'file',
    required: true,
  })
  file: Express.Multer.File;
}
