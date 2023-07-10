import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useImplerState } from '@store/impler.context';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAPIState } from '@store/api.context';
import { IErrorObject, IOption, ITemplate, IUpload } from '@impler/shared';
import { useAppState } from '@store/app.context';
import { downloadFileFromURL, getFileNameFromUrl, notifier, ParentWindow } from '@util';
import { IFormvalues, IUploadValues } from '@types';
import { variables } from '@config';
import { logAmplitudeEvent } from '@amplitude';

interface IUsePhase1Props {
  goNext: () => void;
}

export function usePhase1({ goNext }: IUsePhase1Props) {
  const { api } = useAPIState();
  const { setUploadInfo } = useAppState();
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
    },
    onError(error: IErrorObject) {
      notifier.showError({ message: error.message, title: error.error });
    },
    refetchOnWindowFocus: true,
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
  const {
    control,
    register,
    trigger,
    getValues,
    setValue,
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

  const onDownload = async () => {
    setIsDownloadInProgress(true);
    const isTemplateValid = await trigger('templateId');
    if (!isTemplateValid) {
      setIsDownloadInProgress(false);

      return;
    }

    const foundTemplate = findTemplate();
    if (foundTemplate && foundTemplate.sampleFileUrl) {
      getSignedUrl([foundTemplate.sampleFileUrl, foundTemplate.name + ' (sample).csv']);
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
    trigger,
    register,
    templates,
    isUploadLoading,
    onDownload,
    isDownloadInProgress,
    isInitialDataLoaded: isFetched && !isLoading,
    showSelectTemplate: !templateId,
    onSubmit: handleSubmit(onSubmit),
  };
}
