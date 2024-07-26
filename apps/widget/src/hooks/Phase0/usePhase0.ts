import { useMutation } from '@tanstack/react-query';

import { useAPIState } from '@store/api.context';
import { useAppState } from '@store/app.context';
import { useImplerState } from '@store/impler.context';
import { IErrorObject, IImportConfig } from '@impler/shared';

interface IUsePhase0Props {
  goNext: () => void;
}

export function usePhase0({ goNext }: IUsePhase0Props) {
  const { api } = useAPIState();
  const { projectId, templateId } = useImplerState();
  const { schema, setImportConfig, showWidget } = useAppState();

  const { mutate: fetchImportConfig } = useMutation<IImportConfig, IErrorObject, void>(
    ['importConfig', projectId, templateId],
    () => api.getImportConfig(projectId, templateId),
    {
      onSuccess(importConfigData) {
        setImportConfig(importConfigData);
        goNext();
      },
    }
  );
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
          fetchImportConfig();
        }
      },
    }
  );

  const handleValidate = async () => {
    return checkIsRequestvalid({ projectId, templateId, schema: schema });
  };

  return {
    error,
    isLoading,
    handleValidate,
    isWidgetOpened: showWidget,
  };
}
