import { IsEnum, IsNotEmpty } from 'class-validator';
import { AuthenticatedCommand } from './authenticated.command';
import { UserRolesEnum } from '@impler/shared';

export abstract class ProjectCommand extends AuthenticatedCommand {
  @IsNotEmpty()
  readonly projectId: string;

  @IsEnum(UserRolesEnum)
  readonly role: UserRolesEnum;
}
