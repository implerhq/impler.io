import { ParentWindow, logger } from '@util';
import { useState } from 'react';
import { ApiService } from '@impler/client';
import { IErrorObject } from '@impler/shared';
import { logAmplitudeEvent } from '@amplitude';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface IUseAuthenticationProps {
  api: ApiService;
}
export function useAuthentication({ api }: IUseAuthenticationProps) {
  const queryClient = useQueryClient();
  const [showWidget, setShowWidget] = useState<boolean>(false);
  const { mutate } = useMutation<boolean, IErrorObject, [string, boolean], string[]>(
    ['valid'],
    ([projectId]) => api.checkIsRequestvalid(projectId) as Promise<boolean>,
    {
      onSuccess(isValid, variables) {
        if (isValid) {
          setShowWidget(true);
          queryClient.resetQueries();
          queryClient.invalidateQueries();
          logAmplitudeEvent('OPEN', { hasExtra: variables[1] });
        }
      },
      onError(err) {
        ParentWindow.Close();
        logger.logError(logger.ErrorTypesEnum.INVALID_PROPS, err.message);
      },
    }
  );

  return {
    mutate,
    showWidget,
    setShowWidget,
  };
}
