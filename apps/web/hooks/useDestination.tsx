import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { track } from '@libs/amplitude';
import { modals } from '@mantine/modals';
import { API_KEYS, NOTIFICATION_KEYS } from '@config';
import { DestinationsEnum, IErrorObject, ITemplate } from '@impler/shared';

interface UseDestinationProps {
  template: ITemplate;
}

interface DestinationData {
  destination?: 'webhook' | 'bubbleIo';
  webhook?: {
    callbackUrl: string;
    authHeaderName: string;
    chunkSize: number;
  };
  bubbleIo?: {
    appName: string;
    customDomainName: string;
    environment: string;
    apiPrivateKey: string;
    datatype: string;
  };
}

export function useDestination({ template }: UseDestinationProps) {
  const queryClient = useQueryClient();
  const {
    watch,
    reset,
    control,
    setValue,
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<DestinationData>({
    defaultValues: {
      webhook: {
        chunkSize: 100,
      },
      bubbleIo: {
        environment: 'development',
      },
    },
  });
  useQuery<unknown, IErrorObject, DestinationData, [string, string | undefined]>(
    [API_KEYS.DESTINATION_FETCH, template._id],
    () => commonApi<DestinationData>(API_KEYS.DESTINATION_FETCH as any, { parameters: [template._id] }),
    {
      onSuccess(data) {
        reset(data);
      },
    }
  );
  const { mutate: updateDestination, isLoading: isUpdateDestinationLoading } = useMutation<
    DestinationData,
    IErrorObject,
    DestinationData,
    (string | undefined)[]
  >(
    [API_KEYS.TEMPLATE_UPDATE, template._id],
    (body) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      commonApi<DestinationData>(API_KEYS.DESTINATION_UPDATE as any, { parameters: [template._id], body }),
    {
      onSuccess: (data) => {
        queryClient.setQueryData<DestinationData>([API_KEYS.DESTINATION_FETCH, template._id], data);
        reset(data);
        notify(NOTIFICATION_KEYS.DESTINATION_UPDATED);
      },
      onError(error) {
        notify(NOTIFICATION_KEYS.ERROR_OCCURED, {
          title: 'Destination data could not be updated',
          message: error?.message,
          color: 'red',
        });
      },
    }
  );

  const resetDestination = (data: DestinationData) => {
    modals.openConfirmModal({
      centered: true,
      title: 'Destination will be reset',
      children:
        'Are you sure you want to reset destination? All the destination data will be deleted. This action cannot be undone.',
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => updateDestination(data),
    });
  };
  const onSubmit = (data: DestinationData) => {
    if (data.destination === DestinationsEnum.BUBBLEIO && !data.bubbleIo?.appName && !data.bubbleIo?.customDomainName) {
      setError(
        'bubbleIo.appName',
        {
          type: 'manual',
          message: 'Either App Name or Custom Domain Name is required',
        },
        {
          shouldFocus: true,
        }
      );
      setError('bubbleIo.customDomainName', {
        type: 'manual',
        message: 'Either App Name or Custom Domain Name is required',
      });

      return;
    }
    updateDestination(data);
    track({
      name: 'DESTINATION UPDATED',
      properties: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        destination: data.destination,
      },
    });
  };

  return {
    watch,
    errors,
    control,
    register,
    setValue,
    resetDestination,
    onSubmit: handleSubmit(onSubmit),
    isUpdateImportLoading: isUpdateDestinationLoading,
  };
}
