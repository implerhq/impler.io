import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional } from 'class-validator';

export class ReplaceDto {
  @ApiProperty({
    description: 'Find value',
  })
  @IsOptional()
  find: string;

  @ApiProperty({
    description: 'Replace value',
  })
  @IsOptional()
  replace: string;

  @ApiProperty({
    description: 'Column name',
  })
  @IsDefined()
  column: string;

  @ApiProperty({
    description: 'Case sensitive',
  })
  @IsOptional()
  caseSensitive: boolean;

  @ApiProperty({
    description: 'Match entire cell',
  })
  @IsOptional()
  matchEntireCell: boolean;
}
