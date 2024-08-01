import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IUserJob } from '@impler/shared';

interface JobsInfoContextType {
  jobsInfo: IUserJob;
  setJobsInfo: (jobInfo) => void;
}

const JobsInfoContext = createContext<JobsInfoContextType | null>(null);

interface JobsInfoProviderProps {
  children: ReactNode;
}

export const JobsInfoProvider: React.FC<JobsInfoProviderProps> = ({ children }) => {
  const [jobsInfo, setJobsInfo] = useState<IUserJob>({} as IUserJob);

  return <JobsInfoContext.Provider value={{ jobsInfo, setJobsInfo }}>{children}</JobsInfoContext.Provider>;
};

export const useJobsInfo = (): JobsInfoContextType => {
  const context = useContext(JobsInfoContext);
  if (context === null) {
    throw new Error('useJobsInfo must be used within a JobsInfoProvider');
  }

  return context;
};
