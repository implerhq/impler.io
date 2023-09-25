import React, { createContext, useContext, useState } from 'react';
import { IAppStore } from '../types';

interface AppContextProviderProps extends React.PropsWithChildren, Omit<IAppStore, 'profileInfo' | 'setProfileInfo'> {}

const AppContext = createContext<IAppStore | null>(null);

const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [profileInfo, setProfileInfo] = useState<IProfileData | undefined>(undefined);

  return <AppContext.Provider value={{ profileInfo, setProfileInfo }}>{children}</AppContext.Provider>;
};

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) throw new Error('App Context must be used within AppContextProvider');

  return context;
}

export default AppContextProvider;
