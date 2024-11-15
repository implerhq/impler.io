import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { FlowsEnum } from '@types';
import { useAPIState } from '@store/api.context';
import { useAppState } from '@store/app.context';
import { identifyImportIntent } from '@amplitude';
import { useImplerState } from '@store/impler.context';
import { FileMimeTypesEnum, IErrorObject, IImportConfig, TemplateModeEnum } from '@impler/shared';
import { isValidFileType } from 'util/helpers/common.helpers';

interface IUsePhase0Props {
  goNext: () => void;
}

export function usePhase0({ goNext }: IUsePhase0Props) {
  const { api } = useAPIState();
  const { projectId, templateId } = useImplerState();
  const [fileError, setFileError] = useState<string | null>(null);
  const { schema, setImportConfig, showWidget, setFlow, file } = useAppState();

  const { mutate: fetchImportConfig } = useMutation<IImportConfig, IErrorObject, void>(
    ['importConfig', projectId, templateId],
    () => api.getImportConfig(projectId, templateId),
    {
      onSuccess(importConfigData) {
        setFlow(
          importConfigData.mode === TemplateModeEnum.AUTOMATIC ? FlowsEnum.AUTO_IMPORT : FlowsEnum.STRAIGHT_IMPORT
        );
        setImportConfig(importConfigData);
        const allowedTypes = [
          FileMimeTypesEnum.CSV,
          FileMimeTypesEnum.EXCEL,
          FileMimeTypesEnum.EXCELM,
          FileMimeTypesEnum.EXCELX,
        ];

        if (file && !isValidFileType(file as Blob)) {
          setFileError(`Only ${allowedTypes.join(',')} are supported`);
        } else {
          goNext();
        }
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
    return checkIsRequestvalid({ projectId, templateId, schema });
  };

  return {
    error,
    fileError,
    isLoading,
    handleValidate,
    isWidgetOpened: showWidget,
  };
}
