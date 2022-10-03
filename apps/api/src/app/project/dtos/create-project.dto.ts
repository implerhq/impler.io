import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, Validate } from 'class-validator';
import { UniqueValidator } from '../../shared/framework/IsUniqueValidator';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Name of the project',
  })
  @IsString()
  @IsDefined()
  name: string;

  @ApiProperty({
    description: 'Code of the project',
  })
  @IsString()
  @IsDefined()
  @Validate(UniqueValidator, ['Project', 'code'], {
    message: 'Code is already taken',
  })
  code: string;
}
