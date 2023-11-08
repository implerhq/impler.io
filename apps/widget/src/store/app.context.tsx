import React, { createContext, useContext, useState } from 'react';
import { IImportConfig, ITemplate, IUpload } from '@impler/shared';
import { IAppStore } from '../types';

interface AppContextProviderProps
  extends React.PropsWithChildren,
    Omit<
      IAppStore,
      'uploadInfo' | 'setUploadInfo' | 'reset' | 'templateInfo' | 'importConfig' | 'setTemplateInfo' | 'setImportConfig'
    > {}

const AppContext = createContext<IAppStore | null>(null);

const AppContextProvider = ({
  children,
  primaryColor,
  title,
  data,
  schema,
  output,
  host,
  showWidget,
  setShowWidget,
}: AppContextProviderProps) => {
  const [importConfig, setImportConfig] = useState<IImportConfig>({} as IImportConfig);
  const [templateInfo, setTemplateInfo] = useState<ITemplate>({} as ITemplate);
  const [uploadInfo, setUploadInfo] = useState<IUpload>({} as IUpload);

  const reset = (ProjectName: string) => {
    setImportConfig({} as IImportConfig);
    setTemplateInfo({ name: ProjectName } as ITemplate);
    setUploadInfo({} as IUpload);
  };

  return (
    <AppContext.Provider
      value={{
        title,
        host,
        reset,
        data,
        schema,
        output,
        showWidget,
        uploadInfo,
        templateInfo,
        importConfig,
        primaryColor,
        setShowWidget,
        setUploadInfo,
        setImportConfig,
        setTemplateInfo,
      }}
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
