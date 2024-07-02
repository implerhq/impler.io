import { useQuery } from '@tanstack/react-query';

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

  const { error, isLoading } = useQuery<boolean, IErrorObject, any, (string | undefined)[]>(
    ['valid', projectId, templateId, schema],
    () => api.checkIsRequestvalid(projectId, templateId, schema) as Promise<boolean>,
    {
      onSuccess(valid) {
        if (valid) {
          goNext();
        }
      },
      refetchOnWindowFocus: true,
    }
  );

  return {
    error,
    isLoading,
    isWidgetOpened: showWidget,
  };
}
