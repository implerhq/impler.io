import { AbilityBuilder, createMongoAbility, MongoAbility } from '@casl/ability';

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
    case 'admin':
      can('manage', 'all');
      break;
    case 'tech':
      can('read', 'Homepage');
      can('create', 'Imports');
      can('read', 'Imports');
      can('read', 'Analytics');
      can('read', 'Settings');
      can('read', 'AccessToken');
      can('read', 'TeamMembers');
      break;
    case 'finance':
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
