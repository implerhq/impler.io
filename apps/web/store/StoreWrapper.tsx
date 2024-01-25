import { PropsWithChildren } from 'react';
import AppContextProvider from './app.context';

export function StoreWrapper({ children }: PropsWithChildren) {
  return <AppContextProvider>{children}</AppContextProvider>;
}
