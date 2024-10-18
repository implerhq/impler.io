import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commonApi } from '@libs/api';
import { API_KEYS, MODAL_KEYS, NOTIFICATION_KEYS } from '@config';
import { IErrorObject } from '@impler/shared';
import { modals } from '@mantine/modals';
import { notify } from '@libs/notify';
import { CancelSubscriptionModal } from '@components/home/PlanDetails/CancelSubscriptionModal';

interface UseCancelPlanProps {
  email: string;
}

export function useCancelPlan({ email }: UseCancelPlanProps) {
  const queryClient = useQueryClient();
  const { mutate: cancelPlan, isLoading: isCancelPlanLoading } = useMutation<
    unknown,
    IErrorObject,
    void,
    [string, string]
  >([API_KEYS.CANCEL_SUBSCRIPTION, email], () => commonApi(API_KEYS.CANCEL_SUBSCRIPTION as any, {}), {
    onSuccess(data: any) {
      queryClient.invalidateQueries([API_KEYS.FETCH_ACTIVE_SUBSCRIPTION, email]);
      modals.close(MODAL_KEYS.PAYMENT_PLANS);
      notify(NOTIFICATION_KEYS.MEMBERSHIP_CANCELLED, {
        title: 'Subscription Cancelled',
        message: `Your subscription is cancelled.
         Your current subscription will continue till ${data.expiryDate}. You won't be charged again.`,
        color: 'red',
      });
      modals.closeAll();
    },
  });

  const openCancelPlanModal = () => {
    modals.open({
      children: <CancelSubscriptionModal />,
      size: '2xl',
      withCloseButton: false,
    });
  };

  return {
    cancelPlan,
    openCancelPlanModal,
    isCancelPlanLoading,
  };
}
