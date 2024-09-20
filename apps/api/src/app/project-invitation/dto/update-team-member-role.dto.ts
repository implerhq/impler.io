import { UserRolesEnum } from '@impler/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class UpdateTeamMemberRoleDto {
  @ApiProperty({
    description: 'Id of the User whose role is to be changed',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'New Role of the User that to be asssigned',
  })
  @IsEnum(UserRolesEnum)
  role: UserRolesEnum;
}
