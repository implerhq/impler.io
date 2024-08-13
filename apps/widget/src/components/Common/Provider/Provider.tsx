import { PropsWithChildren } from 'react';
import { ApiService } from '@impler/client';
import ImplerContextProvider from '@store/impler.context';
import APIContextProvider from '@store/api.context';
import AppContextProvider from '@store/app.context';
import { JobsInfoProvider } from '@store/jobinfo.context';
import { WIDGET_TEXTS } from '@impler/shared';

interface IProviderProps {
  // app-context
  title?: string;
  texts: typeof WIDGET_TEXTS;
  primaryColor: string;
  output?: string;
  schema?: string;
  data?: Record<string, string | number>[];
  host: string;
  showWidget: boolean;
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
    title,
    texts,
    output,
    projectId,
    templateId,
    extra,
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
            texts={texts}
            output={output}
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
