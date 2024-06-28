import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { logAmplitudeEvent } from '@amplitude';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useAPIState } from '@store/api.context';
import { useAppState } from '@store/app.context';
import { useImplerState } from '@store/impler.context';

import { variables } from '@config';
import { useSample } from '@hooks/useSample';
import { notifier, ParentWindow } from '@util';
import { useTemplates } from '@hooks/useTemplates';
import { IFormvalues, IUploadValues } from '@types';
import { IErrorObject, ITemplate, IUpload, FileMimeTypesEnum, IImportConfig } from '@impler/shared';

interface IUsePhase1Props {
  goNext: () => void;
}

export function usePhase1({ goNext }: IUsePhase1Props) {
  const {
    control,
    register,
    trigger,
    setValue,
    setError,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormvalues>();
  const { api } = useAPIState();
  const { getSignedUrl, onDownload } = useSample();
  const [excelSheetNames, setExcelSheetNames] = useState<string[]>([]);
  const { projectId, templateId, authHeaderValue, extra } = useImplerState();
  const [isDownloadInProgress, setIsDownloadInProgress] = useState<boolean>(false);
  const { setUploadInfo, setTemplateInfo, setImportConfig, output, schema, data } = useAppState();
  const { templates } = useTemplates({ projectId });

  const { isFetched: isImportConfigLoaded, isLoading: isImportConfigLoading } = useQuery<
    IImportConfig,
    IErrorObject,
    IImportConfig
  >(['importConfig'], () => api.getImportConfig(projectId), {
    onSuccess(importConfigResponse) {
      setImportConfig(importConfigResponse);
    },
    onError(error: IErrorObject) {
      notifier.showError({ message: error.message, title: error.error });
    },
  });

  const { isLoading: isUploadLoading, mutate: submitUpload } = useMutation<IUpload, IErrorObject, IUploadValues>(
    ['upload'],
    (values: any) => api.uploadFile(values),
    {
      onSuccess(uploadData) {
        ParentWindow.UploadStarted({ templateId: uploadData._templateId, uploadId: uploadData._id });
        setUploadInfo(uploadData);
        goNext();
      },
      onError(error: IErrorObject) {
        notifier.showError({ title: error.error, message: error.message });
      },
    }
  );

  const { mutate: getExcelSheetNames } = useMutation<string[], IErrorObject, { file: File }>(
    ['getExcelSheetNames'],
    (file) => api.getExcelSheetNames(file),
    {
      onSuccess(sheetNames) {
        if (sheetNames.length <= 1) {
          setValue('selectedSheetName', sheetNames[0]);
          handleSubmit(uploadFile)();
        } else setExcelSheetNames(sheetNames);
      },
      onError(error: IErrorObject) {
        notifier.showError({ title: error.error, message: error.message });
      },
    }
  );

  const findTemplate = (): ITemplate | undefined => {
    let foundTemplate: ITemplate | undefined;
    const selectedTemplateValue = getValues('templateId');
    if (selectedTemplateValue && templates) {
      foundTemplate = templates.find((templateItem) => templateItem._id === selectedTemplateValue);
    }
    if (!foundTemplate) notifier.showError('TEMPLATE_NOT_FOUND');
    else if (foundTemplate.totalColumns === variables.baseIndex) notifier.showError('INCOMPLETE_TEMPLATE');
    else return foundTemplate;

    return undefined;
  };
  const onTemplateChange = (newTemplateId: string) => {
    const foundTemplate = templates?.find((templateItem) => templateItem._id === newTemplateId);
    if (foundTemplate) {
      setTemplateInfo(foundTemplate);
      setValue('templateId', newTemplateId);
      trigger('templateId');
    }
  };
  const onDownloadClick = async () => {
    setIsDownloadInProgress(true);
    const isTemplateValid = await trigger('templateId');
    if (!isTemplateValid) {
      setIsDownloadInProgress(false);

      return;
    }

    const foundTemplate = findTemplate();
    if (foundTemplate && ((Array.isArray(data) && data.length > variables.baseIndex) || schema)) {
      onDownload({ template: foundTemplate });
    } else if (foundTemplate && foundTemplate.sampleFileUrl) {
      getSignedUrl([
        foundTemplate.sampleFileUrl,
        foundTemplate.name + ` (sample).${foundTemplate.sampleFileUrl.substr(-4, 4)}`,
      ]);
    }
    setIsDownloadInProgress(false);
  };
  const uploadFile = async (submitData: IFormvalues) => {
    const foundTemplate = findTemplate();
    if (foundTemplate) {
      submitData.templateId = foundTemplate._id;
      logAmplitudeEvent('UPLOAD', { fileSize: submitData.file.size, fileType: submitData.file.type });
      submitUpload({
        ...submitData,
        authHeaderValue,
        extra,
        schema,
        output,
      });
    }
  };
  const onSubmit = async () => {
    await trigger();
    const file = getValues('file');
    if (file && [FileMimeTypesEnum.EXCEL, FileMimeTypesEnum.EXCELX].includes(file.type as FileMimeTypesEnum)) {
      getExcelSheetNames({ file: file });
    } else {
      handleSubmit(uploadFile)();
    }
  };
  const onSelectSheetModalReset = () => {
    setExcelSheetNames([]);
  };

  useEffect(() => {
    if (templateId) {
      setValue('templateId', templateId);
      const foundTemplate = templates?.find((templateItem) => templateItem._id === templateId);
      if (foundTemplate) {
        setTemplateInfo(foundTemplate);
      }
    }
  }, [templateId, templates]);

  return {
    control,
    errors,
    setError,
    register,
    onSubmit,
    templates,
    onDownloadClick,
    excelSheetNames,
    isUploadLoading,
    onTemplateChange,
    isDownloadInProgress,
    onSelectSheetModalReset,
    showSelectTemplate: !templateId,
    onSelectExcelSheet: handleSubmit(uploadFile),
    isInitialDataLoaded: isImportConfigLoaded && !isImportConfigLoading,
  };
}
