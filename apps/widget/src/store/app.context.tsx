import React, { createContext, useContext, useState } from 'react';
import { ITemplate, IUpload } from '@impler/shared';
import { IAppStore } from '../types';

interface AppContextProviderProps
  extends React.PropsWithChildren,
    Omit<IAppStore, 'uploadInfo' | 'setUploadInfo' | 'reset' | 'templateInfo' | 'setTemplateInfo'> {}

const AppContext = createContext<IAppStore | null>(null);

const AppContextProvider = ({ children, primaryColor, title }: AppContextProviderProps) => {
  const [templateInfo, setTemplateInfo] = useState<ITemplate>({} as ITemplate);
  const [uploadInfo, setUploadInfo] = useState<IUpload>({} as IUpload);

  const reset = () => {
    setUploadInfo({} as IUpload);
  };

  return (
    <AppContext.Provider
      value={{ title, templateInfo, setTemplateInfo, uploadInfo, setUploadInfo, reset, primaryColor }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) throw new Error('App Context must be used within AppContextProvider');

  return context;
}

export default AppContextProvider;
