import { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

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

  const { data: importConfigData, refetch } = useQuery<IImportConfig, IErrorObject, IImportConfig>(
    ['importConfig', projectId, templateId],
    () => api.getImportConfig(projectId, templateId),
    {
      cacheTime: 0,
      enabled: false,
    }
  );

  const handleValidate = async () => {
    return checkIsRequestvalid({ projectId, templateId, schema: schema });
  };

  useEffect(() => {
    if (importConfigData) setImportConfig(importConfigData);
  }, [importConfigData]);

  return {
    error,
    refetch,
    isLoading,
    handleValidate,
    isWidgetOpened: showWidget,
  };
}
