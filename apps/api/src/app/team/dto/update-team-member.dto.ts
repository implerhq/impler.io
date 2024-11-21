import { UserRolesEnum } from '@impler/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateTeamMemberDto {
  @ApiProperty({
    description: 'New Role of the User that to be asssigned',
  })
  @IsEnum(UserRolesEnum)
  role: UserRolesEnum;
}
