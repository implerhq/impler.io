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
  templateId?: string;
  accessToken?: string;
  extra?: string;
  authHeaderValue?: string;
  primaryColor: string;
}

export function Provider(props: PropsWithChildren<IProviderProps>) {
  const { api, projectId, templateId, accessToken, extra, authHeaderValue, children, primaryColor } = props;

  return (
    <ImplerContextProvider
      projectId={projectId}
      templateId={templateId}
      accessToken={accessToken}
      extra={extra}
      authHeaderValue={authHeaderValue}
    >
      <APIContextProvider api={api}>
        <AppContextProvider primaryColor={primaryColor}>{children}</AppContextProvider>
      </APIContextProvider>
    </ImplerContextProvider>
  );
}
