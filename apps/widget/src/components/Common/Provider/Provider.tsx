import { PropsWithChildren } from 'react';
import { ApiService } from '@impler/client';
import ImplerContextProvider from '@store/impler.context';
import APIContextProvider from '@store/api.context';
import AppContextProvider from '@store/app.context';

interface IProviderProps {
  // api-context
  api: ApiService;
  // impler-context
  projectId: string;
  template?: string;
  accessToken?: string;
  extra?: string;
  authHeaderValue?: string;
}

export function Provider(props: PropsWithChildren<IProviderProps>) {
  const { api, projectId, template, accessToken, extra, authHeaderValue, children } = props;

  return (
    <ImplerContextProvider
      projectId={projectId}
      template={template}
      accessToken={accessToken}
      extra={extra}
      authHeaderValue={authHeaderValue}
    >
      <APIContextProvider api={api}>
        <AppContextProvider>{children}</AppContextProvider>
      </APIContextProvider>
    </ImplerContextProvider>
  );
}
