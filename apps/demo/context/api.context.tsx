import { ApiService } from '@impler/client';
import React, { createContext, useContext } from 'react';

interface IApiStore {
  api: ApiService;
}

interface APIContextProviderProps extends React.PropsWithChildren, IApiStore {}

const APIContext = createContext<IApiStore | null>(null);

const APIContextProvider = ({
  api,
  // other
  children,
}: APIContextProviderProps) => {
  return (
    <APIContext.Provider
      value={{
        api,
      }}
    >
      {children}
    </APIContext.Provider>
  );
};

export function useAPIState() {
  const context = useContext(APIContext);
  if (!context) throw new Error('API Context must be used within APIContextProvider');

  return context;
}

export default APIContextProvider;
