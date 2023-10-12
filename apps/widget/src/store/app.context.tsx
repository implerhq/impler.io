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

const AppContextProvider = ({ children, primaryColor, title, data, schema, output }: AppContextProviderProps) => {
  const [importConfig, setImportConfig] = useState<IImportConfig>({} as IImportConfig);
  const [templateInfo, setTemplateInfo] = useState<ITemplate>({} as ITemplate);
  const [uploadInfo, setUploadInfo] = useState<IUpload>({} as IUpload);

  const reset = () => {
    setImportConfig({} as IImportConfig);
    setTemplateInfo({} as ITemplate);
    setUploadInfo({} as IUpload);
  };

  return (
    <AppContext.Provider
      value={{
        title,
        templateInfo,
        importConfig,
        setImportConfig,
        setTemplateInfo,
        uploadInfo,
        setUploadInfo,
        reset,
        primaryColor,
        data,
        schema,
        output,
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
