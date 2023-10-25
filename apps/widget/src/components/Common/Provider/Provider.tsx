import { PropsWithChildren } from 'react';
import { ApiService } from '@impler/client';
import ImplerContextProvider from '@store/impler.context';
import APIContextProvider from '@store/api.context';
import AppContextProvider from '@store/app.context';

interface IProviderProps {
  // app-context
  title?: string;
  primaryColor: string;
  output?: string;
  schema?: string;
  data?: Record<string, string | number>[];
  host: string;
  // api-context
  api: ApiService;
  // impler-context
  projectId: string;
  templateId?: string;
  accessToken?: string;
  extra?: string;
  authHeaderValue?: string;
}

export function Provider(props: PropsWithChildren<IProviderProps>) {
  const {
    api,
    data,
    title,
    output,
    projectId,
    templateId,
    accessToken,
    extra,
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
      accessToken={accessToken}
      extra={extra}
      authHeaderValue={authHeaderValue}
    >
      <APIContextProvider api={api}>
        <AppContextProvider
          host={host}
          output={output}
          title={title}
          primaryColor={primaryColor}
          data={data}
          schema={schema}
        >
          {children}
        </AppContextProvider>
      </APIContextProvider>
    </ImplerContextProvider>
  );
}
