import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commonApi } from '@libs/api';
import { API_KEYS, MODAL_KEYS, NOTIFICATION_KEYS } from '@config';
import { IErrorObject, ISubscriptionData } from '@impler/shared';
import { modals } from '@mantine/modals';
import { notify } from '@libs/notify';
import { useForm } from 'react-hook-form';
import { CancelSubscriptionModal } from '@components/home/PlanDetails/CancelSubscriptionModal';

interface UseCancelPlanProps {
  projectId?: string;
}

interface CancelPlanFormData {
  reasons: string;
}

export function useCancelPlan({ projectId }: UseCancelPlanProps) {
  const queryClient = useQueryClient();

  const { mutate: cancelPlan, isLoading: isCancelPlanLoading } = useMutation<
    ISubscriptionData,
    IErrorObject,
    CancelPlanFormData,
    [string, string]
  >(
    [API_KEYS.CANCEL_SUBSCRIPTION, projectId],
    ({ reasons }) =>
      commonApi(API_KEYS.CANCEL_SUBSCRIPTION as any, {
        parameters: [projectId!],
        body: { reasons },
      }),
    {
      onSuccess(data) {
        queryClient.invalidateQueries([API_KEYS.FETCH_ACTIVE_SUBSCRIPTION, projectId]);

        modals.close(MODAL_KEYS.PAYMENT_PLANS);
        modals.closeAll();

        notify(NOTIFICATION_KEYS.MEMBERSHIP_CANCELLED, {
          title: 'Subscription Cancelled',
          message: `Your subscription is cancelled.
           Your current subscription will continue till ${data.expiryDate}. You won't be charged again.`,
          color: 'red',
        });
      },
    }
  );

  const { control, handleSubmit } = useForm<CancelPlanFormData>({});

  const onSubmit = (data: CancelPlanFormData) => {
    cancelPlan({ reasons: data.reasons });
  };

  const openCancelPlanModal = () => {
    modals.open({
      children: (
        <CancelSubscriptionModal
          control={control}
          handleSubmit={handleSubmit(onSubmit)}
          isCancelPlanLoading={isCancelPlanLoading}
        />
      ),
      withCloseButton: false,
      centered: true,
    });
  };

  return {
    openCancelPlanModal,
    cancelPlan,
    isCancelPlanLoading,
    control,
    handleSubmit,
    onSubmit,
  };
}
