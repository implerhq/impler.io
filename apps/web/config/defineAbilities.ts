import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { UserRolesEnum } from '@impler/shared';
import { ActionsEnum, AppAbility, ROLE_BASED_ACCESS, SubjectsEnum } from './constants.config';

export const defineAbilitiesFor = (role?: string, isOwner?: boolean): AppAbility => {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  if (isOwner) {
    can(ActionsEnum.MANAGE, SubjectsEnum.ALL);

    return build();
  }

  const roleBasedAccess = ROLE_BASED_ACCESS[role as UserRolesEnum] || [];

  roleBasedAccess.forEach(({ action, subject }) => {
    can(action, subject);
  });

  return build();
};
