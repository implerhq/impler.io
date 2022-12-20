import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useImplerState } from '@store/impler.context';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAPIState } from '@store/api.context';
import { IErrorObject, IOption, ITemplate, IUpload } from '@impler/shared';
import { useAppState } from '@store/app.context';
import { downloadFileFromURL, notifier, ParentWindow } from '@util';
import { IFormvalues, IUploadValues } from '@types';

interface IUsePhase1Props {
  goNext: () => void;
}

export function usePhase1({ goNext }: IUsePhase1Props) {
  const { api } = useAPIState();
  const { setUploadInfo } = useAppState();
  const [templates, setTemplates] = useState<IOption[]>([]);
  const [isDownloadInProgress, setIsDownloadInProgress] = useState<boolean>(false);
  const { projectId, template, authHeaderValue, extra } = useImplerState();
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
    if (selectedTemplateValue && dataTemplates) {
      selectedTemplate = dataTemplates.find((templateItem) => templateItem._id === selectedTemplateValue);
    } else if (template && dataTemplates) {
      selectedTemplate = dataTemplates.find(
        (templateItem) => templateItem.code === template || templateItem._id === template
      );
    }

    if (selectedTemplate && selectedTemplate.sampleFileUrl)
      downloadFileFromURL(selectedTemplate.sampleFileUrl, `${selectedTemplate.code}-sample.csv`);
    else notifier.showError('INCOMPLETE_TEMPLATE');
    setIsDownloadInProgress(false);
  };

  const onSubmit = (submitData: IFormvalues) => {
    if (!submitData.template && dataTemplates) {
      const selectedTemplate = dataTemplates.find(
        (templateItem) => templateItem.code === template || templateItem._id === template
      );
      if (selectedTemplate) {
        submitData.template = selectedTemplate._id;
        submitUpload({
          ...submitData,
          authHeaderValue,
          extra,
        });
      }
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
    showSelectTemplate: !template,
    onSubmit: handleSubmit(onSubmit),
  };
}
