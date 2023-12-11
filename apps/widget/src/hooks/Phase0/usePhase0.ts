import { IErrorObject } from '@impler/shared';
import { useAPIState } from '@store/api.context';
import { useAppState } from '@store/app.context';
import { useImplerState } from '@store/impler.context';
import { useMutation } from '@tanstack/react-query';

interface IUsePhase0Props {
  goNext: () => void;
}

export function usePhase0({ goNext }: IUsePhase0Props) {
  const { api } = useAPIState();
  const AppContext = useAppState();
  const { projectId, templateId } = useImplerState();

  const {
    error,
    isLoading,
    mutate: checkIsRequestvalid,
  } = useMutation<boolean, IErrorObject, any, string[]>(
    ['valid'],
    () => api.checkIsRequestvalid(projectId, templateId, AppContext.schema) as Promise<boolean>,
    {
      onSuccess(valid) {
        if (valid) {
          goNext();
        }
      },
    }
  );

  const handleValidate = async () => {
    return checkIsRequestvalid({ projectId, templateId, schema: AppContext.schema });
  };

  return {
    error,
    isLoading,
    handleValidate,
    isWidgetOpened: AppContext.showWidget,
  };
}
