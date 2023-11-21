import { IErrorObject } from '@impler/shared';
import { useAPIState } from '@store/api.context';
import { useAppState } from '@store/app.context';
import { useImplerState } from '@store/impler.context';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

interface IUsePhase0Props {
  goNext: () => void;
  onError: () => void;
}

export function usePhase0({ goNext, onError }: IUsePhase0Props) {
  const { api } = useAPIState();

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState('');

  const { projectId, templateId } = useImplerState();
  const AppContext = useAppState();

  const { mutate: checkIsRequestvalid } = useMutation<boolean, IErrorObject, any, string[]>(
    ['valid', projectId],

    () => api.checkIsRequestvalid(projectId, templateId, AppContext.schema) as Promise<boolean>,
    {
      onSuccess(valid) {
        setIsLoading(false);
        if (valid) {
          goNext();
        }
      },
      onError(error) {
        setIsLoading(false);
        setIsError(error.message);
        onError();
      },
    }
  );

  const handleValidate = async () => {
    return checkIsRequestvalid({ projectId, templateId, schema: AppContext.schema });
  };

  return {
    isLoading,
    isError,
    handleValidate,
    isWidgetOpened: AppContext.showWidget,
  };
}
