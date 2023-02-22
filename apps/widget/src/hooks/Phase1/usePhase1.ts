import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useImplerState } from '@store/impler.context';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAPIState } from '@store/api.context';
import { IErrorObject, IOption, ITemplate, IUpload } from '@impler/shared';
import { useAppState } from '@store/app.context';
import { downloadFileFromURL, getFileNameFromUrl, notifier, ParentWindow } from '@util';
import { IFormvalues, IUploadValues } from '@types';
import { variables } from '@config';

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

    let foundTemplate: ITemplate | undefined;
    const selectedTemplateValue = getValues('template');
    if (selectedTemplateValue && dataTemplates) {
      foundTemplate = dataTemplates.find((templateItem) => templateItem._id === selectedTemplateValue);
    } else if (template && dataTemplates) {
      foundTemplate = dataTemplates.find(
        (templateItem) => templateItem.code === template || templateItem._id === template
      );
    }

    if (foundTemplate && foundTemplate.sampleFileUrl) {
      getSignedUrl([foundTemplate.sampleFileUrl, foundTemplate.name + ' (sample).csv']);
    } else if (foundTemplate && !foundTemplate.sampleFileUrl) notifier.showError('INCOMPLETE_TEMPLATE');
    else notifier.showError('TEMPLATE_NOT_FOUND');
    setIsDownloadInProgress(false);
  };

  const onSubmit = (submitData: IFormvalues) => {
    if ((template || submitData.template) && dataTemplates) {
      const foundTemplate = dataTemplates.find(
        (templateItem) =>
          templateItem.code === template || templateItem._id === template || templateItem._id === submitData.template
      );
      if (foundTemplate) {
        submitData.template = foundTemplate._id;
        submitUpload({
          ...submitData,
          authHeaderValue,
          extra,
        });

        return;
      }
    }
    notifier.showError('TEMPLATE_NOT_FOUND');
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
