import { useMutation, useQueryClient } from '@tanstack/react-query';
import { commonApi } from '@libs/api';
import { API_KEYS, MODAL_KEYS, NOTIFICATION_KEYS } from '@config';
import { IErrorObject, ISubscriptionData } from '@impler/shared';
import { modals } from '@mantine/modals';
import { notify } from '@libs/notify';
import { CancelSubscriptionModal } from '@components/home/PlanDetails/CancelSubscriptionModal';

interface UseCancelPlanProps {
  email: string;
  projectId?: string;
}

export function useCancelPlan({ email, projectId }: UseCancelPlanProps) {
  const queryClient = useQueryClient();

  const { mutate: cancelPlan, isLoading: isCancelPlanLoading } = useMutation<
    ISubscriptionData,
    IErrorObject,
    void,
    [string, string]
  >([API_KEYS.CANCEL_SUBSCRIPTION, email], () => commonApi(API_KEYS.CANCEL_SUBSCRIPTION as any, {}), {
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
  });

  const openCancelPlanModal = () => {
    modals.open({
      children: <CancelSubscriptionModal />,
      withCloseButton: false,
      centered: true,
    });
  };

  return {
    cancelPlan,
    openCancelPlanModal,
    isCancelPlanLoading,
  };
}
