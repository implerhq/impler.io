/* eslint-disable multiline-comment-style */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { track } from '@libs/amplitude';
import { modals } from '@mantine/modals';
import { API_KEYS, NOTIFICATION_KEYS } from '@config';
import { DestinationsEnum, IErrorObject, IDestinationData, ITemplate } from '@impler/shared';
import { SampleWebhookDataConfiguration } from '../components/imports/destination/SampleWebhookDataConfiguration';

interface UseDestinationProps {
  template: ITemplate;
}

interface SendSampleRequestParams {
  templateId?: string;
  authHeaderValue?: string;
  extra?: string;
}

interface SampleWebhookFormData {
  authHeaderValue?: string;
  extraData?: string;
}

export function useDestination({ template }: UseDestinationProps) {
  const queryClient = useQueryClient();
  const [destination, setDestination] = useState<DestinationsEnum | undefined>();

  const sampleWebhookForm = useForm<SampleWebhookFormData>({
    defaultValues: {
      authHeaderValue: undefined,
      extraData: '{"key": "value"}',
    },
  });
  const {
    watch,
    reset,
    control,
    setValue,
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<IDestinationData>({
    defaultValues: {
      webhook: {
        chunkSize: 100,
      },
    },
  });
  useQuery<unknown, IErrorObject, IDestinationData, [string, string | undefined]>(
    [API_KEYS.DESTINATION_FETCH, template._id],
    () => commonApi<IDestinationData>(API_KEYS.DESTINATION_FETCH as any, { parameters: [template._id] }),
    {
      onSuccess(data) {
        reset(data);
        setDestination(data?.destination);
      },
    }
  );
  const { mutate: updateDestination, isLoading: isUpdateDestinationLoading } = useMutation<
    IDestinationData,
    IErrorObject,
    IDestinationData,
    (string | undefined)[]
  >(
    [API_KEYS.TEMPLATE_UPDATE, template._id],
    (body) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      commonApi<IDestinationData>(API_KEYS.DESTINATION_UPDATE as any, { parameters: [template._id], body }),
    {
      onSuccess: (data) => {
        queryClient.setQueryData<IDestinationData>([API_KEYS.DESTINATION_FETCH, template._id], data);
        reset(data);
        modals.closeAll();
        setDestination(data?.destination);
        notify(NOTIFICATION_KEYS.DESTINATION_UPDATED);
      },
      onError(error) {
        modals.closeAll();
        notify(NOTIFICATION_KEYS.ERROR_OCCURED, {
          title: 'Destination data could not be updated',
          message: error?.message,
          color: 'red',
        });
      },
    }
  );

  const { mutate: mapBubbleIoColumns, isLoading: isMapBubbleIoColumnsLoading } = useMutation<
    IDestinationData,
    IErrorObject,
    IDestinationData,
    (string | undefined)[]
  >(
    [API_KEYS.BUBBLEIO_MAP_COLUMNS, template._id],
    (body) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      commonApi<IDestinationData>(API_KEYS.BUBBLEIO_MAP_COLUMNS as any, { parameters: [template._id], body }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [API_KEYS.TEMPLATE_CUSTOMIZATION_GET, template._id] });
        track({ name: 'BULK COLUMN UPDATE', properties: {} });
        notify('COLUMNS_UPDATED');
      },
      onError(error) {
        notify(NOTIFICATION_KEYS.ERROR_OCCURED, {
          title: 'Error mapping columns with Bubble.io',
          message: error?.message,
          color: 'red',
        });
      },
    }
  );
  const {
    mutate: sendSampleRequestApi,
    isLoading: isSendSampleRequestLoading,
    isPending: isSendSampleRequestPending,
  } = useMutation<unknown, IErrorObject, SendSampleRequestParams>(
    (apiConfig: SendSampleRequestParams) =>
      commonApi<unknown>(API_KEYS.TEMPLATE_SAMPLE_GET as any, {
        parameters: [apiConfig.templateId || template._id],
        body: {
          authHeaderValue: apiConfig.authHeaderValue || undefined,
          extra: apiConfig.extra || undefined,
        },
      }),
    {
      onSuccess: () => {
        notify(NOTIFICATION_KEYS.DESTINATION_UPDATED, {
          title: 'Test webhook sent successfully',
          message: 'Sample data delivered to your endpoint',
          color: 'green',
        });
      },
      onError(error: IErrorObject) {
        notify(NOTIFICATION_KEYS.ERROR_OCCURED, {
          title: 'Failed to send test webhook',
          message: error.message || 'Unable to reach webhook endpoint',
          color: 'red',
        });
      },
    }
  );

  const onSampleWebhookSubmit = (data: SampleWebhookFormData) => {
    const params: SendSampleRequestParams = {
      templateId: template._id,
      extra: data.extraData || undefined,
    };
    sendSampleRequestApi(params);
    modals.closeAll();
  };

  const openSampleRequestModal = () => {
    modals.open({
      title: 'Configure Test Webhook',
      children: <SampleWebhookDataConfiguration templateId={template._id} template={template} />,
      withCloseButton: true,
      centered: true,
      size: 'xl',
    });
  };

  const mapBubbleIoColumnsClick = () => {
    modals.openConfirmModal({
      centered: true,
      title: 'Existing columns will be reset',
      children: 'Are you sure you want to map colums with Bubble.io? This action cannot be undone.',
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: handleSubmit((data) => mapBubbleIoColumns(data)),
    });
  };
  const resetDestination = (data: IDestinationData) => {
    modals.openConfirmModal({
      centered: true,
      title: 'Destination will be reset',
      children:
        'Are you sure you want to reset destination? All the destination data will be deleted. This action cannot be undone.',
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        setDestination(undefined);
        updateDestination(data);
      },
    });
  };
  const onSubmit = (data: IDestinationData) => {
    if (
      data.destination === DestinationsEnum.BUBBLEIO &&
      !data.bubbleIo?.bubbleAppUrl &&
      !data.bubbleIo?.apiPrivateKey
    ) {
      setError(
        'bubbleIo.bubbleAppUrl',
        {
          type: 'manual',
          message: 'Bubble App URL is required',
        },
        {
          shouldFocus: true,
        }
      );
      setError('bubbleIo.apiPrivateKey', {
        type: 'manual',
        message: 'API Private Key is required',
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
    destination,
    setDestination,
    resetDestination,
    updateDestination,
    sendSampleRequestApi,
    openSampleRequestModal,
    isSendSampleRequestLoading,
    isSendSampleRequestPending,
    mapBubbleIoColumns,
    mapBubbleIoColumnsClick,
    isMapBubbleIoColumnsLoading,
    onSubmit: handleSubmit(onSubmit),
    isUpdateImportLoading: isUpdateDestinationLoading,
    sampleWebhookForm: {
      register: sampleWebhookForm.register,
      errors: sampleWebhookForm.formState.errors,
      control: sampleWebhookForm.control,
      handleSubmit: sampleWebhookForm.handleSubmit(onSampleWebhookSubmit),
    },
  };
}
