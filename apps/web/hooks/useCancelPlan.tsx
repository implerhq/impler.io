import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_KEYS, CONSTANTS, MODAL_KEYS, NOTIFICATION_KEYS } from '@config';
import { Defaults, IErrorObject, ISubscriptionData } from '@impler/shared';
import { modals } from '@mantine/modals';
import { notify } from '@libs/notify';
import { useForm } from 'react-hook-form';
import { CancelSubscriptionModal } from '@components/home/PlanDetails/CancelSubscriptionModal';
import { useSubOSIntegration } from './useSubOSIntegration';
import dayjs from 'dayjs';

interface CancelPlanFormData {
  reasons: string[];
}

export function useCancelPlan() {
  const subOSIntegration = useSubOSIntegration();
  const { cancelSubscription } = subOSIntegration;
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
  >([API_KEYS.CANCEL_SUBSCRIPTION], ({ reasons }) => cancelSubscription({ reasons }), {
    onSuccess(data) {
      queryClient.invalidateQueries([API_KEYS.FETCH_ACTIVE_SUBSCRIPTION]);
      modals.close(MODAL_KEYS.PAYMENT_PLANS);
      modals.closeAll();
      notify(NOTIFICATION_KEYS.MEMBERSHIP_CANCELLED, {
        title: 'Subscription Cancelled',
        message: CONSTANTS.SUBSCRIPTION_CANCELLED_MESSAGE(dayjs(data.expiryDate).format(Defaults.DATE_FORMAT)),
        color: 'red',
      });
    },
    onError(error: IErrorObject) {
      // eslint-disable-next-line no-console
      console.error('Subscription cancellation failed:', error);
      notify(NOTIFICATION_KEYS.MEMBERSHIP_CANCELLED, {
        title: 'Subscription Cancellation Failed',
        message: error.message || 'An error occurred while cancelling your subscription. Please try again.',
        color: 'red',
      });
    },
  });

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
