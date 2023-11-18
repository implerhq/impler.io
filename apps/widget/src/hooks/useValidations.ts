import { ApiService } from '@impler/client';
import { IErrorObject } from '@impler/shared';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

interface IUseValidationProps {
  api: ApiService;
  projectId: string;
  isWidgetShown: boolean;
}
const useValidation = ({ api, projectId, isWidgetShown }: IUseValidationProps) => {
  const [isLoading, setIsLoading] = useState<boolean>();
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (isWidgetShown) {
      setIsLoading(true);
    }
  }, [isWidgetShown]);

  useQuery<boolean, IErrorObject, any, string[]>(
    ['valid'],
    () => api.checkIsRequestvalid(projectId) as Promise<boolean>,
    {
      onSuccess() {},
      onError() {
        setIsError(true);
      },
    }
  );

  return {
    isLoading,
    isError,
  };
};

export default useValidation;
