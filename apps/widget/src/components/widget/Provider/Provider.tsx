import { ApiService } from '@impler/client';
import ImplerContextProvider from '@store/impler.context';
import APIContextProvider from '@store/api.context';
import { useEffect, PropsWithChildren } from 'react';
import { useQuery } from '@tanstack/react-query';
import { logger, ParentWindow } from '@util';
import { IErrorObject } from '@impler/shared';

interface IProviderProps {
  // api-context
  backendUrl: string;
  // impler-context
  projectId: string;
  template?: string;
  accessToken?: string;
  extra?: string;
  authHeaderValue?: string;
}

let api: ApiService;

export function Provider(props: PropsWithChildren<IProviderProps>) {
  const { backendUrl, projectId, template, accessToken, extra, authHeaderValue, children } = props;
  if (!api) api = new ApiService(backendUrl);
  const { data, refetch, error } = useQuery<Boolean, IErrorObject, any, string[]>(
    ['valid'],
    () => api.checkIsRequestvalid(projectId, template) as Promise<boolean>,
    {
      enabled: false,
      retry: 0,
    }
  );

  useEffect(() => {
    if (accessToken) {
      api.setAuthorizationToken(accessToken);
    }
    refetch();
  }, []);

  useEffect(() => {
    if (data) setIsValidAuthenticated();
    else if (error) {
      setAuthenticationError(error.message);
    }
  }, [error, data]);

  function setIsValidAuthenticated() {
    ParentWindow.AuthenticationValid();
  }

  function setAuthenticationError(message: string) {
    logger.logError(logger.ErrorTypesEnum.INVALID_PROPS, message);
    ParentWindow.AuthenticationError(message);
  }

  return (
    <ImplerContextProvider
      projectId={projectId}
      template={template}
      accessToken={accessToken}
      extra={extra}
      authHeaderValue={authHeaderValue}
    >
      <APIContextProvider api={api}>{children}</APIContextProvider>
    </ImplerContextProvider>
  );
}
