import { PropsWithChildren } from 'react';
import { ApiService } from '@impler/client';
import ImplerContextProvider from '@store/impler.context';
import APIContextProvider from '@store/api.context';
import AppContextProvider from '@store/app.context';

interface IProviderProps {
  // app-context
  title?: string;
  primaryColor: string;
  data?: Record<string, string | number>[];
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
  const { api, data, title, projectId, templateId, accessToken, extra, authHeaderValue, children, primaryColor } =
    props;

  return (
    <ImplerContextProvider
      projectId={projectId}
      templateId={templateId}
      accessToken={accessToken}
      extra={extra}
      authHeaderValue={authHeaderValue}
    >
      <APIContextProvider api={api}>
        <AppContextProvider title={title} primaryColor={primaryColor} data={data}>
          {children}
        </AppContextProvider>
      </APIContextProvider>
    </ImplerContextProvider>
  );
}
