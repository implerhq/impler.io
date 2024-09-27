import { createContext } from 'react';
import { createContextualCan } from '@casl/react';
import { AppAbility } from '@config';

export const AbilityContext = createContext<AppAbility | null>(null);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const Can = createContextualCan(AbilityContext.Consumer);
