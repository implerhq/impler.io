import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { track } from '@libs/amplitude';
import { API_KEYS, NOTIFICATION_KEYS } from '@config';
import { IErrorObject, ITemplate } from '@impler/shared';

interface UseDestinationProps {
  template: ITemplate;
}

interface UpdateDestinationData {
  authHeaderName: string;
  callbackUrl: string;
}

export function useDestination({ template }: UseDestinationProps) {
  const queryClient = useQueryClient();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateDestinationData>();
  const { mutate: updateImport, isLoading: isUpdateImportLoading } = useMutation<
    ITemplate,
    IErrorObject,
    UpdateDestinationData,
    (string | undefined)[]
  >(
    [API_KEYS.TEMPLATE_UPDATE, template._id],
    (data) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      commonApi<ITemplate>(API_KEYS.TEMPLATE_UPDATE as any, { parameters: [template._id], body: { ...data } }),
    {
      onSuccess: (data) => {
        queryClient.setQueryData<ITemplate[]>([API_KEYS.TEMPLATES_LIST, template?._projectId], (oldData) =>
          oldData?.map((item) => (item._id === data._id ? data : item))
        );
        queryClient.setQueryData<ITemplate>([API_KEYS.TEMPLATE_DETAILS, template._id], data);
        notify(NOTIFICATION_KEYS.DESTINATION_UPDATED);
      },
    }
  );

  useEffect(() => {
    reset({
      authHeaderName: template.authHeaderName,
      callbackUrl: template.callbackUrl,
    });
  }, [template, reset]);

  const onSubmit = (data: UpdateDestinationData) => {
    updateImport(data);
    track({
      name: 'DESTINATION UPDATED',
      properties: {
        hasAuthHeaderName: !!data.authHeaderName,
        hasCallbackUrl: !!data.callbackUrl,
      },
    });
  };

  return {
    errors,
    register,
    isUpdateImportLoading,
    onSubmit: handleSubmit(onSubmit),
  };
}
