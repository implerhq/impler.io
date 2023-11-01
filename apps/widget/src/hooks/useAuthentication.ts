import { useState } from 'react';
import { ApiService } from '@impler/client';
import { IErrorObject } from '@impler/shared';
import { logger, ParentWindow } from '@util';
import { useQuery } from '@tanstack/react-query';

interface IUseAuthenticationProps {
  api: ApiService;
  projectId: string;
}
export function useAuthentication({ api, projectId }: IUseAuthenticationProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { refetch } = useQuery<Boolean, IErrorObject, any, string[]>(
    ['valid'],
    () => api.checkIsRequestvalid(projectId) as Promise<boolean>,
    {
      enabled: false,
      retry: 0,
      onSuccess(isValid) {
        if (isValid) {
          setIsAuthenticated(true);
          ParentWindow.AuthenticationValid();
        }
      },
      onError(err) {
        logger.logError(logger.ErrorTypesEnum.INVALID_PROPS, err.message);
        ParentWindow.AuthenticationError(err.message);
      },
    }
  );

  return {
    isAuthenticated,
    refetch,
  };
}
