import React, { createContext, useContext } from 'react';
import { IImplerStore } from '../types';

interface ImplerContextProviderProps extends React.PropsWithChildren, IImplerStore {}

const ImplerContext = createContext<IImplerStore | null>(null);

const ImplerContextProvider = ({
  projectId,
  templateId,
  accessToken,
  authHeaderValue,
  extra,
  // other
  children,
}: ImplerContextProviderProps) => {
  return (
    <ImplerContext.Provider
      value={{
        projectId,
        templateId,
        accessToken,
        authHeaderValue,
        extra,
      }}
    >
      {children}
    </ImplerContext.Provider>
  );
};

export function useImplerState() {
  const context = useContext(ImplerContext);
  if (!context) throw new Error('Impler Context must be used within ImplerContextProvider');

  return context;
}

export default ImplerContextProvider;
