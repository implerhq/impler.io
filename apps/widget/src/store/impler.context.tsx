import React, { createContext, useContext, useState } from 'react';
import { IImplerStore } from '../types';

interface ImplerContextProviderProps extends React.PropsWithChildren, Omit<IImplerStore, 'setTemplateId'> {}

const ImplerContext = createContext<IImplerStore | null>(null);

const ImplerContextProvider = ({
  projectId,
  templateId,
  authHeaderValue,
  extra,
  // other
  children,
}: ImplerContextProviderProps) => {
  const [stateTemplateId, setTemplateId] = useState<string | undefined>();

  return (
    <ImplerContext.Provider
      value={{
        projectId,
        templateId: templateId || stateTemplateId,
        authHeaderValue,
        setTemplateId,
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
