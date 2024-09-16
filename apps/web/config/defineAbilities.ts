import { defineAbility } from '@casl/ability';

export type Actions = 'manage' | 'read' | 'create' | 'update' | 'buy';
export type Subjects =
  | 'Homepage'
  | 'Imports'
  | 'Analytics'
  | 'Settings'
  | 'Plan'
  | 'File'
  | 'AccessToken'
  | 'Cards'
  | 'all';

export const defineAbilitiesFor = (role?: string) =>
  defineAbility((can) => {
    switch (role) {
      case 'admin':
        can('manage', 'all');
        break;
      case 'tech':
        can('read', 'Homepage');
        can('create', 'Imports');
        can('read', 'Imports');
        can('update', 'Imports');
        can('read', 'Analytics');
        can('read', 'Settings');
        can('read', 'AccessToken');
        break;
      case 'finance':
        can('read', 'Homepage');
        can('read', 'Settings');
        can('buy', 'Plan');
        can('read', 'Cards');
        break;
    }
  });
