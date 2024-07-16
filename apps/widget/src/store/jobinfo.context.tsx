import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IUserJob } from '@impler/shared';

interface JobsInfoContextType {
  jobsInfo: IUserJob | null;
  setJobsInfo: React.Dispatch<React.SetStateAction<IUserJob | null>>;
}

const defaultContextValue: JobsInfoContextType = {
  jobsInfo: null,
  setJobsInfo: () => null,
};

const JobsInfoContext = createContext<JobsInfoContextType>(defaultContextValue);

interface JobsInfoProviderProps {
  children: ReactNode;
}

export const JobsInfoProvider: React.FC<JobsInfoProviderProps> = ({ children }) => {
  const [jobsInfo, setJobsInfo] = useState<IUserJob | null>(null);

  return <JobsInfoContext.Provider value={{ jobsInfo, setJobsInfo }}>{children}</JobsInfoContext.Provider>;
};

export const useJobsInfo = (): JobsInfoContextType => {
  const context = useContext(JobsInfoContext);
  if (context === defaultContextValue) {
    throw new Error('useJobsInfo must be used within a JobsInfoProvider');
  }

  return context;
};
