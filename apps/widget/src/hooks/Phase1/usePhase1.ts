import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useImplerState } from '@store/impler.context';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAPIState } from '@store/api.context';
import { IErrorObject, IOption, ITemplate, IUpload } from '@impler/shared';
import { useAppState } from '@store/app.context';

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
  const { projectId, template, authHeaderValue, extra } = useImplerState();
  const [templates, setTemplates] = useState<IOption[]>([]);
  const { isFetched, isLoading } = useQuery<ITemplate[], IErrorObject, ITemplate[], string[]>(
    ['templates'],
    () => api.getTemplates(projectId),
    {
      onSuccess(data) {
        setTemplates(
          data.map((item) => ({
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
    handleSubmit,
    formState: { errors },
  } = useForm<IFormvalues>();

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
    isInitialDataLoaded: isFetched && !isLoading,
    showSelectTemplate: !template,
    onSubmit: handleSubmit(onSubmit),
  };
}
