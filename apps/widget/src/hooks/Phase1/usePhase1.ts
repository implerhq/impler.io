import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useImplerState } from '@store/impler.context';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAPIState } from '@store/api.context';
import { IErrorObject, IOption, ITemplate, IUpload } from '@impler/shared';
import { useAppState } from '@store/app.context';
import { downloadFileFromURL } from '@util';

interface IFormvalues {
  template: string;
  file: File;
}

interface IUploadValues extends IFormvalues {
  authHeaderValue?: string;
  extra?: string;
}

interface IUsePhase1Props {
  goNext: () => void;
}

export function usePhase1({ goNext }: IUsePhase1Props) {
  const { api } = useAPIState();
  const { setUploadInfo } = useAppState();
  const [templates, setTemplates] = useState<IOption[]>([]);
  const [isDownloadInProgress, setIsDownloadInProgress] = useState<boolean>(false);
  const { projectId, template, authHeaderValue, extra } = useImplerState();
  const { data, isFetched, isLoading } = useQuery<ITemplate[], IErrorObject, ITemplate[], string[]>(
    ['templates'],
    () => api.getTemplates(projectId),
    {
      onSuccess(templatesResponse) {
        setTemplates(
          templatesResponse.map((item) => ({
            label: item.name,
            value: item._id,
          }))
        );
      },
    }
  );
  const { isLoading: isUploadLoading, mutate } = useMutation<IUpload, IErrorObject, IUploadValues>(
    ['upload'],
    (values: any) => api.uploadFile(values),
    {
      onSuccess(uploadData) {
        setUploadInfo(uploadData);
        goNext();
      },
    }
  );
  const {
    control,
    register,
    trigger,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormvalues>();

  const onDownload = async () => {
    setIsDownloadInProgress(true);
    const isTemplateValid = await trigger('template');
    if (!isTemplateValid) {
      setIsDownloadInProgress(false);

      return;
    }

    let selectedTemplate: ITemplate | undefined;
    const selectedTemplateValue = getValues('template');
    if (selectedTemplateValue && data) {
      selectedTemplate = data.find((templateItem) => templateItem._id === selectedTemplateValue);
    } else if (template && data) {
      selectedTemplate = data.find((templateItem) => templateItem.code === template || templateItem._id === template);
    }

    if (selectedTemplate) downloadFileFromURL(selectedTemplate.sampleFileUrl);
    setIsDownloadInProgress(false);
  };

  const onSubmit = (submitData: IFormvalues) => {
    mutate({
      ...submitData,
      authHeaderValue,
      extra,
    });
  };

  return {
    control,
    errors,
    register,
    templates,
    isUploadLoading,
    onDownload,
    isDownloadInProgress,
    isInitialDataLoaded: isFetched && !isLoading,
    showSelectTemplate: !template,
    onSubmit: handleSubmit(onSubmit),
  };
}
