import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDefined } from 'class-validator';

export class ImportConfigResponseDto {
  @ApiPropertyOptional({
    description: 'Whether to show branding',
  })
  @IsDefined()
  @IsBoolean()
  showBranding: boolean;
}
