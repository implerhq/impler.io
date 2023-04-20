import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsString, IsMongoId } from 'class-validator';

export class ValidRequestDto {
  @ApiProperty({
    description: 'Id of the project',
  })
  @IsMongoId()
  @IsDefined()
  projectId: string;

  @ApiProperty({
    description: 'ID of the template',
  })
  @IsString()
  @IsOptional()
  templateId?: string;
}
