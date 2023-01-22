import { useState, useEffect } from 'react';
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
  const { data, refetch, error } = useQuery<Boolean, IErrorObject, any, string[]>(
    ['valid'],
    () => api.checkIsRequestvalid(projectId) as Promise<boolean>,
    {
      enabled: false,
      retry: 0,
    }
  );

  useEffect(() => {
    if (data) setIsValidAuthenticated();
    else if (error) {
      setAuthenticationError(error.message);
    }
  }, [error, data]);

  function setIsValidAuthenticated() {
    setIsAuthenticated(true);
    ParentWindow.AuthenticationValid();
  }

  function setAuthenticationError(message: string) {
    logger.logError(logger.ErrorTypesEnum.INVALID_PROPS, message);
    ParentWindow.AuthenticationError(message);
  }

  return {
    isAuthenticated,
    refetch,
  };
}
