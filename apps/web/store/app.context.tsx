import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppAbility } from 'config/defineAbilities';

interface AppContextType {
  profileInfo?: IProfileData;
  setAbility: (ability: AppAbility) => void;
  setProfileInfo: (profileInfo?: IProfileData) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const AppContextProvider = ({
  children,
  setAbility,
}: {
  children: ReactNode;
  setAbility: (ability: AppAbility) => void;
}) => {
  const [profileInfo, setProfileInfo] = useState<IProfileData | undefined>(undefined);

  return <AppContext.Provider value={{ profileInfo, setProfileInfo, setAbility }}>{children}</AppContext.Provider>;
};

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) throw new Error('App Context must be used within AppContextProvider');

  return context;
}

export default AppContextProvider;
