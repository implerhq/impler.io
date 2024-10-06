import { useMutation } from '@tanstack/react-query';

import { FlowsEnum } from '@types';
import { useAPIState } from '@store/api.context';
import { useAppState } from '@store/app.context';
import { identifyImportIntent } from '@amplitude';
import { useImplerState } from '@store/impler.context';
import { IErrorObject, IImportConfig, TemplateModeEnum } from '@impler/shared';

interface IUsePhase0Props {
  goNext: () => void;
}

export function usePhase0({ goNext }: IUsePhase0Props) {
  const { api } = useAPIState();
  const { projectId, templateId } = useImplerState();
  const { schema, setImportConfig, showWidget, setFlow } = useAppState();

  const { mutate: fetchImportConfig } = useMutation<IImportConfig, IErrorObject, void>(
    ['importConfig', projectId, templateId],
    () => api.getImportConfig(projectId, templateId),
    {
      onSuccess(importConfigData) {
        setFlow(
          importConfigData.mode === TemplateModeEnum.AUTOMATIC ? FlowsEnum.AUTO_IMPORT : FlowsEnum.STRAIGHT_IMPORT
        );
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
        identifyImportIntent({ projectId, templateId });
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
