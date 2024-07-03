import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsMongoId } from 'class-validator';

export class ValidRequestDto {
  @ApiProperty({
    description: 'Id of the project',
  })
  @IsMongoId({
    message: 'Invalid project id',
  })
  @IsDefined()
  projectId: string;

  @ApiProperty({
    description: 'ID of the template',
  })
  @IsMongoId({
    message: 'Invalid template id',
  })
  @IsOptional()
  templateId?: string;

  @IsOptional()
  schema?: string;
}
