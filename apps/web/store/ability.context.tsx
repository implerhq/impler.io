import { createContext } from 'react';
import { createContextualCan } from '@casl/react';

export const AbilityContext = createContext(null);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const Can = createContextualCan(AbilityContext.Consumer);
