import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class ProjectInvitationDto {
  @ApiProperty({
    description: 'Name of the project to be invited into',
  })
  @IsString()
  projectName: string;

  @ApiProperty({
    description: 'Id of the project to be invited into',
  })
  @IsString()
  projectId: string;

  @ApiProperty({
    description: 'List of Emails that will recieve the invitation',
  })
  @IsArray()
  invitationEmailsTo: string[];

  @ApiProperty({
    description: 'The role that the invited members will be assigned to',
  })
  @IsString()
  role: string;
}
