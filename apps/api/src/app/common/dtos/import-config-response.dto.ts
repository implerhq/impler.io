import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsString } from 'class-validator';

export class ImportConfigResponseDto {
  @ApiPropertyOptional({
    description: 'Whether to show branding',
  })
  @IsDefined()
  @IsBoolean()
  showBranding: boolean;

  @ApiPropertyOptional({
    description: 'Whether the current Import is Manual is Atomatic',
  })
  @IsDefined()
  @IsString()
  mode: string;
}
