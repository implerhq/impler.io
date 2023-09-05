import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { logAmplitudeEvent } from '@amplitude';
import { useMutation, useQuery } from '@tanstack/react-query';

import { variables } from '@config';
import { useAPIState } from '@store/api.context';
import { useAppState } from '@store/app.context';
import { IFormvalues, IUploadValues } from '@types';
import { useImplerState } from '@store/impler.context';
import { IErrorObject, IOption, ITemplate, IUpload } from '@impler/shared';
import { downloadFile, downloadFileFromURL, getFileNameFromUrl, notifier, ParentWindow } from '@util';

interface IUsePhase1Props {
  goNext: () => void;
}

export function usePhase1({ goNext }: IUsePhase1Props) {
  const { api } = useAPIState();
  const { setUploadInfo, setTemplateInfo, data } = useAppState();
  const [templates, setTemplates] = useState<IOption[]>([]);
  const [isDownloadInProgress, setIsDownloadInProgress] = useState<boolean>(false);
  const { projectId, templateId, authHeaderValue, extra } = useImplerState();
  const {
    data: dataTemplates,
    isFetched,
    isLoading,
  } = useQuery<ITemplate[], IErrorObject, ITemplate[], string[]>(['templates'], () => api.getTemplates(projectId), {
    onSuccess(templatesResponse) {
      setTemplates(
        templatesResponse.map((item) => ({
          label: item.name,
          value: item._id,
        }))
      );
      if (templateId) {
        const foundTemplate = templatesResponse.find((templateItem) => templateItem._id === templateId);
        if (foundTemplate) {
          setTemplateInfo(foundTemplate);
        }
      }
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
  const { mutate: getSignedUrl } = useMutation<string, IErrorObject, [string, string]>(
    ['getSignedUrl'],
    ([fileUrl]) => api.getSignedUrl(getFileNameFromUrl(fileUrl)),
    {
      onSuccess(signedUrl, queryVariables) {
        downloadFileFromURL(signedUrl, queryVariables[variables.firstIndex]);
      },
      onError(error: IErrorObject) {
        notifier.showError({ title: error.error, message: error.message });
      },
    }
  );
  const { mutate: downloadSample } = useMutation<
    ArrayBuffer,
    IErrorObject,
    [string, Record<string, string | number>[] | undefined, string]
  >(
    ['downloadSample'],
    ([providedTemplateId, prefilledData]) => api.downloadSample(providedTemplateId, prefilledData),
    {
      onSuccess(excelFileData, queryVariables) {
        downloadFile(
          new Blob([excelFileData], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }),
          queryVariables[variables.secondIndex] as string
        );
      },
    }
  );
  const {
    control,
    register,
    trigger,
    getValues,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormvalues>();

  useEffect(() => {
    if (templateId) setValue('templateId', templateId);
  }, [templateId]);

  const findTemplate = (): ITemplate | undefined => {
    let foundTemplate: ITemplate | undefined;
    const selectedTemplateValue = getValues('templateId');
    if (selectedTemplateValue && dataTemplates) {
      foundTemplate = dataTemplates.find((templateItem) => templateItem._id === selectedTemplateValue);
    }
    if (!foundTemplate) notifier.showError('TEMPLATE_NOT_FOUND');
    else if (foundTemplate.totalColumns === variables.baseIndex) notifier.showError('INCOMPLETE_TEMPLATE');
    else return foundTemplate;

    return undefined;
  };
  const onTemplateChange = (newTemplateId: string) => {
    const foundTemplate = dataTemplates?.find((templateItem) => templateItem._id === newTemplateId);
    if (foundTemplate) {
      setTemplateInfo(foundTemplate);
      setValue('templateId', newTemplateId);
      trigger('templateId');
    }
  };
  const onDownload = async () => {
    setIsDownloadInProgress(true);
    const isTemplateValid = await trigger('templateId');
    if (!isTemplateValid) {
      setIsDownloadInProgress(false);

      return;
    }

    const foundTemplate = findTemplate();
    if (foundTemplate && Array.isArray(data) && data.length > variables.baseIndex) {
      downloadSample([foundTemplate._id, data, foundTemplate.name + '.xlsx']);
    } else if (foundTemplate && foundTemplate.sampleFileUrl) {
      getSignedUrl([foundTemplate.sampleFileUrl, foundTemplate.name + ' (sample).xlsx']);
    }
    setIsDownloadInProgress(false);
  };

  const onSubmit = (submitData: IFormvalues) => {
    const foundTemplate = findTemplate();
    if (foundTemplate) {
      submitData.templateId = foundTemplate._id;
      logAmplitudeEvent('UPLOAD', { fileSize: submitData.file.size, fileType: submitData.file.type });
      submitUpload({
        ...submitData,
        authHeaderValue,
        extra,
      });
    }
  };

  return {
    control,
    errors,
    setError,
    register,
    templates,
    onDownload,
    isUploadLoading,
    onTemplateChange,
    isDownloadInProgress,
    isInitialDataLoaded: isFetched && !isLoading,
    showSelectTemplate: !templateId,
    onSubmit: handleSubmit(onSubmit),
  };
}
