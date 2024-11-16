import React, { createContext, useContext, useState } from 'react';
import { FlowsEnum, IAppStore } from '../types';
import { IUpload } from '@impler/client';
import { IImportConfig, ITemplate } from '@impler/shared';

interface AppContextProviderProps
  extends React.PropsWithChildren,
    Omit<
      IAppStore,
      | 'uploadInfo'
      | 'setUploadInfo'
      | 'reset'
      | 'flow'
      | 'setFlow'
      | 'templateInfo'
      | 'importConfig'
      | 'setTemplateInfo'
      | 'setImportConfig'
      | 'importId'
      | 'setImportId'
      | 'imageSchema'
      | 'setImageSchema'
    > {}

const AppContext = createContext<IAppStore | null>(null);

const AppContextProvider = ({
  children,
  primaryColor,
  title,
  texts,
  data,
  sampleFile,
  schema,
  output,
  host,
  showWidget,
  setShowWidget,
}: AppContextProviderProps) => {
  const [importId, setImportId] = useState<string>();
  const [imageSchema, setImageSchema] = useState<string>();
  const [uploadInfo, setUploadInfo] = useState<IUpload>({} as IUpload);
  const [flow, setFlow] = useState<FlowsEnum>(FlowsEnum.STRAIGHT_IMPORT);
  const [templateInfo, setTemplateInfo] = useState<ITemplate>({} as ITemplate);
  const [importConfig, setImportConfig] = useState<IImportConfig>({} as IImportConfig);

  const reset = () => {
    setUploadInfo({} as IUpload);
    setImportId(undefined);
    setImageSchema(undefined);
  };

  return (
    <AppContext.Provider
      value={{
        title,
        texts,
        host,
        reset,
        data,
        flow,
        schema,
        output,
        setFlow,
        importId,
        showWidget,
        uploadInfo,
        setImportId,
        imageSchema,
        sampleFile,
        templateInfo,
        importConfig,
        primaryColor,
        setShowWidget,
        setUploadInfo,
        setImageSchema,
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
