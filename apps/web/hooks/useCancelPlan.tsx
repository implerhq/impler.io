import dayjs from 'dayjs';
import { useCancelSubscription } from 'subos-frontend';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useAppState } from 'store/app.context';
import { API_KEYS, CancellationModeEnum, CONSTANTS, MODAL_KEYS, NOTIFICATION_KEYS } from '@config';
import { Defaults, IErrorObject, ISubscriptionData } from '@impler/shared';
import { modals } from '@mantine/modals';
import { notify } from '@libs/notify';
import { CancelSubscriptionModal } from '@components/home/PlanDetails/CancelSubscriptionModal';

interface CancelPlanFormData {
  reasons: string[];
}

export function useCancelPlan() {
  const { profileInfo } = useAppState();
  const queryClient = useQueryClient();
  const { cancelSubscription } = useCancelSubscription();

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

  const { mutate: cancelPlan, isLoading: isCancelPlanLoading } = useMutation<unknown, IErrorObject, CancelPlanFormData>(
    [API_KEYS.CANCEL_SUBSCRIPTION],
    async () =>
      cancelSubscription(profileInfo!.email, {
        cancellationMode: CancellationModeEnum.END_OF_PERIOD,
      }),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries([API_KEYS.FETCH_ACTIVE_SUBSCRIPTION]);
        modals.close(MODAL_KEYS.PAYMENT_PLANS);
        modals.closeAll();
        notify(NOTIFICATION_KEYS.MEMBERSHIP_CANCELLED, {
          title: 'Subscription Cancelled',
          message: CONSTANTS.SUBSCRIPTION_CANCELLED_MESSAGE(
            dayjs((data as ISubscriptionData).expiryDate).format(Defaults.DATE_FORMAT)
          ),
          color: 'red',
        });
      },
      onError: (error) => {
        notify(NOTIFICATION_KEYS.MEMBERSHIP_CANCELLED, {
          title: 'Subscription Cancellation Failed',
          message: error.message || 'An error occurred while cancelling your subscription. Please try again.',
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
