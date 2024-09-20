import { AbilityBuilder, createMongoAbility, MongoAbility } from '@casl/ability';
import { UserRolesEnum } from '@impler/shared';

export type Actions = 'manage' | 'read' | 'create' | 'update' | 'buy';
export type Subjects =
  | 'Homepage'
  | 'Imports'
  | 'Analytics'
  | 'Settings'
  | 'Plan'
  | 'File'
  | 'TeamMembers'
  | 'AccessToken'
  | 'Cards'
  | 'all';

export type AppAbility = MongoAbility<[Actions, Subjects]>;

export const defineAbilitiesFor = (role?: string): AppAbility => {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  switch (role) {
    case UserRolesEnum.ADMIN:
      can('manage', 'all');
      break;
    case UserRolesEnum.TECH:
      can('read', 'Homepage');
      can('create', 'Imports');
      can('read', 'Imports');
      can('read', 'Analytics');
      can('read', 'Settings');
      can('read', 'AccessToken');
      can('read', 'TeamMembers');
      break;
    case UserRolesEnum.FINANCE:
      can('read', 'Homepage');
      can('read', 'Settings');
      can('buy', 'Plan');
      can('read', 'Cards');
      break;
    default:
      break;
  }

  return build();
};
