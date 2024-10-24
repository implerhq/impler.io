import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RemoveTeammemberDto {
  @ApiProperty({
    description: 'Id of the Project in the environment',
  })
  @IsString()
  projectId: string;

  @ApiProperty({
    description: 'Id of the user who has to be deleted from the environment',
  })
  @IsString()
  userId: string;
}
