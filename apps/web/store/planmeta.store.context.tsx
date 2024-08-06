import { createContext, useState, ReactNode, useContext } from 'react';
import { IPlanMeta, IPlanMetaContext } from 'types/store.types';

const PlanMetaContext = createContext<IPlanMetaContext | undefined>(undefined);

interface PlanMetaProviderProps {
  children: ReactNode;
}

export const PlanMetaProvider = ({ children }: PlanMetaProviderProps) => {
  const [meta, setMeta] = useState<IPlanMeta | null>(null);

  const setPlanMeta = (newMeta: IPlanMeta) => {
    setMeta(newMeta);
  };

  return <PlanMetaContext.Provider value={{ meta, setPlanMeta }}>{children}</PlanMetaContext.Provider>;
};

export const usePlanMetaData = () => {
  const context = useContext(PlanMetaContext);

  if (!context) {
    return;
  }

  return context;
};

export { PlanMetaContext };
