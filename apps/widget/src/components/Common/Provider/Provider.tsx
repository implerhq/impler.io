import { PropsWithChildren } from 'react';
import { ApiService } from '@api';
import { AppearanceConfig, WIDGET_TEXTS, WidgetConfig } from '@impler/client';
import APIContextProvider from '@store/api.context';
import AppContextProvider from '@store/app.context';
import { JobsInfoProvider } from '@store/jobinfo.context';
import ImplerContextProvider from '@store/impler.context';

interface IProviderProps {
  // app-context
  title?: string;
  texts: typeof WIDGET_TEXTS;
  config?: WidgetConfig;
  primaryColor: string;
  appearance?: AppearanceConfig;
  output?: string;
  sampleFile?: File | Blob;
  schema?: string;
  data?: string;
  host: string;
  showWidget: boolean;
  maxRecords?: number;
  setShowWidget: (status: boolean) => void;
  // api-context
  api: ApiService;
  // impler-context
  projectId: string;
  templateId?: string;
  extra?: string;
  authHeaderValue?: string;
}

export function Provider(props: PropsWithChildren<IProviderProps>) {
  const {
    api,
    data,
    config,
    appearance,
    title,
    sampleFile,
    texts,
    output,
    projectId,
    templateId,
    extra,
    maxRecords,
    showWidget,
    setShowWidget,
    authHeaderValue,
    children,
    primaryColor,
    schema,
    host,
  } = props;

  return (
    <ImplerContextProvider
      projectId={projectId}
      templateId={templateId}
      extra={extra}
      authHeaderValue={authHeaderValue}
    >
      <JobsInfoProvider>
        <APIContextProvider api={api}>
          <AppContextProvider
            host={host}
            data={data}
            title={title}
            sampleFile={sampleFile}
            config={config}
            appearance={appearance}
            texts={texts}
            output={output}
            maxRecords={maxRecords}
            schema={schema}
            showWidget={showWidget}
            primaryColor={primaryColor}
            setShowWidget={setShowWidget}
          >
            {children}
          </AppContextProvider>
        </APIContextProvider>
      </JobsInfoProvider>
    </ImplerContextProvider>
  );
}
