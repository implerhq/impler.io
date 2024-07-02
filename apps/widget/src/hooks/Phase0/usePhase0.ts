import { useMutation } from '@tanstack/react-query';

import { IErrorObject } from '@impler/shared';
import { useAPIState } from '@store/api.context';
import { useAppState } from '@store/app.context';
import { useImplerState } from '@store/impler.context';

interface IUsePhase0Props {
  goNext: () => void;
}

export function usePhase0({ goNext }: IUsePhase0Props) {
  const { api } = useAPIState();
  const { schema, showWidget } = useAppState();
  const { projectId, templateId } = useImplerState();

  const {
    error,
    isLoading,
    mutate: checkIsRequestvalid,
  } = useMutation<boolean, IErrorObject, any, string[]>(
    ['valid'],
    () => api.checkIsRequestvalid(projectId, templateId, schema) as Promise<boolean>,
    {
      onSuccess(valid) {
        if (valid) {
          goNext();
        }
      },
    }
  );

  const handleValidate = async () => {
    return checkIsRequestvalid({ projectId, templateId, schema });
  };

  return {
    error,
    isLoading,
    handleValidate,
    isWidgetOpened: showWidget,
  };
}
