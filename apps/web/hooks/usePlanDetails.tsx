import { useQuery } from '@tanstack/react-query';
import { API_KEYS } from '@config';
import { IErrorObject, ISubscriptionData } from '@impler/shared';
import { usePlanMetaData } from 'store/planmeta.store.context';
import { useAppState } from 'store/app.context';
import { modals } from '@mantine/modals';
import { PaymentModal } from '@components/AddCard/PaymentModal';
import { useSubOSIntegration } from './useSubOSIntegration';
import { IPlanMeta } from '@types';

interface UsePlanDetailProps {
  projectId?: string;
  paymentMethodId?: string;
}

export function usePlanDetails({ projectId }: UsePlanDetailProps) {
  const subOSIntegration = useSubOSIntegration();
  const { profileInfo } = useAppState();
  const { meta, setPlanMeta } = usePlanMetaData();

  const {
    data: activePlanDetails,
    isLoading,
    error: subscriptionError,
    refetch: refetchActivePlanDetails,
  } = useQuery<unknown, IErrorObject, ISubscriptionData, [string | undefined]>(
    [API_KEYS.FETCH_ACTIVE_SUBSCRIPTION],
    async () => {
      if (!subOSIntegration.isConfigured || !profileInfo?.email) {
        throw new Error('SubOS not configured or email not available');
      }
      const result = await subOSIntegration.fetchSubscription();

      return result?.data || subOSIntegration.subscription;
    },
    {
      enabled: !!projectId,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      onSuccess: (data) => {
        data?.meta && setPlanMeta(data.meta as IPlanMeta);
      },
    }
  );

  const finalActivePlanDetails = activePlanDetails || subOSIntegration.subscription;
  const finalIsLoading = isLoading || subOSIntegration.loading;

  const onOpenPaymentModal = ({ code, modalId }: { code: string; modalId: string }) => {
    modals.closeAll();
    modals.open({
      size: 'calc(70vw - 40px)',
      withCloseButton: false,
      id: modalId,
      modalId,
      centered: true,
      closeOnClickOutside: true,
      closeOnEscape: true,
      children: (
        <PaymentModal
          email={profileInfo!.email}
          planCode={code}
          projectId={profileInfo!._projectId}
          onClose={() => modals.close(modalId)}
          modalId={modalId}
        />
      ),
    });
  };

  return {
    meta,
    activePlanDetails: finalActivePlanDetails,
    isActivePlanLoading: finalIsLoading,
    subscriptionError: subscriptionError || subOSIntegration.error,
    onOpenPaymentModal,
    refetchActivePlanDetails,
  };
}
