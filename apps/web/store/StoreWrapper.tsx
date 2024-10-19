import AppContextProvider from './app.context';
import { defineAbilitiesFor } from 'config/defineAbilities';
import { PropsWithChildren, useState } from 'react';
import { PlanMetaProvider } from './planmeta.store.context';
import { AbilityContext } from './ability.context';
import { AppAbility } from '@config';

export function StoreWrapper({ children }: PropsWithChildren) {
  const [ability, setAbility] = useState<AppAbility | null>(defineAbilitiesFor());

  return (
    <PlanMetaProvider>
      <AppContextProvider setAbility={setAbility}>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
      </AppContextProvider>
    </PlanMetaProvider>
  );
}
