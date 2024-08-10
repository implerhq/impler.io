import { PropsWithChildren } from 'react';
import AppContextProvider from './app.context';
import { PlanMetaProvider } from './planmeta.store.context';

export function StoreWrapper({ children }: PropsWithChildren) {
  return (
    <PlanMetaProvider>
      <AppContextProvider>{children}</AppContextProvider>
    </PlanMetaProvider>
  );
}
