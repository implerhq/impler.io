import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDefined } from 'class-validator';

export class ImportConfigResponseDto {
  @ApiPropertyOptional({
    description: 'Id of the project',
  })
  @IsDefined()
  @IsBoolean()
  showBranding: boolean;
}
