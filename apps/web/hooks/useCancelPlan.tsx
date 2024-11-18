import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commonApi } from '@libs/api';
import { API_KEYS, MODAL_KEYS, NOTIFICATION_KEYS } from '@config';
import { IErrorObject, ISubscriptionData } from '@impler/shared';
import { modals } from '@mantine/modals';
import { notify } from '@libs/notify';
import { useForm } from 'react-hook-form';
import { CancelSubscriptionModal } from '@components/home/PlanDetails/CancelSubscriptionModal';

interface CancelPlanFormData {
  reasons: string[];
}

export function useCancelPlan() {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CancelPlanFormData>({
    defaultValues: {
      reasons: [],
    },
    mode: 'onSubmit',
  });

  const { mutate: cancelPlan, isLoading: isCancelPlanLoading } = useMutation<
    ISubscriptionData,
    IErrorObject,
    CancelPlanFormData
  >(
    [API_KEYS.CANCEL_SUBSCRIPTION],
    ({ reasons }) =>
      commonApi(API_KEYS.CANCEL_SUBSCRIPTION as any, {
        body: { reasons },
      }),
    {
      onSuccess(data) {
        queryClient.invalidateQueries([API_KEYS.FETCH_ACTIVE_SUBSCRIPTION]);
        modals.close(MODAL_KEYS.PAYMENT_PLANS);
        modals.closeAll();
        notify(NOTIFICATION_KEYS.MEMBERSHIP_CANCELLED, {
          title: 'Subscription Cancelled',
          message: `Your subscription is cancelled. Your current subscription will continue till ${data.expiryDate}. You won't be charged again.`,
          color: 'red',
        });
      },
    }
  );

  const onSubmit = handleSubmit((formData: CancelPlanFormData) => {
    if (formData.reasons.length > 0) {
      cancelPlan(formData);
    }
  });

  const openCancelPlanModal = () => {
    reset({ reasons: [] });

    modals.open({
      children: (
        <CancelSubscriptionModal
          control={control}
          handleSubmit={onSubmit}
          isCancelPlanLoading={isCancelPlanLoading}
          errors={errors}
          onClose={() => {
            reset({ reasons: [] });
            modals.closeAll();
          }}
        />
      ),
      withCloseButton: false,
      centered: true,
      onClose: () => {
        reset({ reasons: [] });
      },
    });
  };

  return {
    openCancelPlanModal,
    cancelPlan,
    isCancelPlanLoading,
  };
}
