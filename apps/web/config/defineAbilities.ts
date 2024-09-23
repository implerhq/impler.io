import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { UserRolesEnum } from '@impler/shared';
import { AppAbility, ROLE_BASED_ACCESS } from './constants.config';

export const defineAbilitiesFor = (role?: string): AppAbility => {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);
  const roleBasedAccess = ROLE_BASED_ACCESS[role as UserRolesEnum] || [];

  roleBasedAccess.forEach(({ action, subject }) => {
    can(action, subject);
  });

  return build();
};
