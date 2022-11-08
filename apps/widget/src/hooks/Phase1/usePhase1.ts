import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useImplerState } from '@store/impler.context';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAPIState } from '@store/api.context';
import { IErrorObject, IOption, ITemplate } from '@impler/shared';

interface IFormvalues {
  template: string;
  file: File;
}

export function usePhase1() {
  const { api } = useAPIState();
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
  const {
    isLoading: isUploadLoading,
    data,
    error,
    mutate,
  } = useMutation({
    mutationKey: ['upload'],
    mutationFn: (values: any) => api.uploadFile(values),
  });
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormvalues>();

  useEffect(() => {
    console.log(data, error);
  }, [data, error]);

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
