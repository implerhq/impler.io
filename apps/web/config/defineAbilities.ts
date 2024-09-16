import { createMongoAbility, MongoAbility } from '@casl/ability';

export type Actions = 'manage' | 'read' | 'create' | 'update' | 'buy';
export type Subjects = 'Homepage' | 'Imports' | 'Analytics' | 'Settings' | 'Plan' | 'all';

export const defineAbilitiesFor = (user: { role?: string }): MongoAbility => {
  const ability = createMongoAbility<[Actions, Subjects]>();

  const role = user.role as 'admin' | 'tech' | 'finance' | undefined;
  switch (role) {
    case 'admin':
      ability.can('manage', 'all');
      break;
    case 'tech':
      ability.can('read', 'Homepage');
      ability.can('create', 'Imports');
      ability.can('read', 'Imports');
      ability.can('update', 'Imports');
      ability.can('read', 'Analytics');
      ability.can('read', 'Settings');
      break;
    case 'finance':
      ability.can('read', 'Homepage');
      ability.can('read', 'Analytics');
      ability.can('read', 'Settings');
      ability.can('buy', 'Plan');
      break;
    default:
      ability.cannot('manage', 'all');
  }

  return ability;
};
