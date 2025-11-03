import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { API_KEYS, MODAL_KEYS } from '@config';
import { IErrorObject, ISubscriptionData } from '@impler/shared';
import { usePlanMetaData } from 'store/planmeta.store.context';
import { useAppState } from 'store/app.context';
import { modals } from '@mantine/modals';
import { track } from '@libs/amplitude';
import { PaymentModal } from '@components/AddCard/PaymentModal';
import { useSubOSIntegration } from './useSubOSIntegration';
import { PlansGrid, usePlans } from 'subos-frontend';
import { IPlanMeta } from '@types';

interface UsePlanDetailProps {
  projectId?: string;
  paymentMethodId?: string;
}

export function usePlanDetails({ projectId }: UsePlanDetailProps) {
  const { setTierFilter, tierFilter } = usePlans();
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

  const showPlans = useCallback(() => {
    track({
      name: 'VIEW PLANS',
      properties: {},
    });
    modals.open({
      id: MODAL_KEYS.PAYMENT_PLANS,
      modalId: MODAL_KEYS.PAYMENT_PLANS,
      children: (
        <PlansGrid
          plans={subOSIntegration.plans}
          selectedPlan={subOSIntegration.selectedPlan}
          billingCycle={subOSIntegration.billingCycle as 'monthly' | 'yearly'}
          loading={subOSIntegration.loading}
          error={subOSIntegration.error}
          onPlanSelect={(plan) => {
            try {
              subOSIntegration.selectPlan(plan);
            } catch (error) {
              console.log('error is >>', error);
            }
          }}
          activePlanCode={finalActivePlanDetails?.planCode}
        />
      ),
      centered: true,
      size: 'calc(50vw - 3rem)',
      withCloseButton: false,
    });
  }, [
    subOSIntegration.plans,
    subOSIntegration.selectedPlan,
    subOSIntegration.billingCycle,
    subOSIntegration.loading,
    subOSIntegration.error,
    subOSIntegration.selectPlan,
    subOSIntegration.changeBillingCycle,
    tierFilter,
    setTierFilter,
    finalActivePlanDetails?.planCode,
  ]);

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
    showPlans,
    onOpenPaymentModal,
    refetchActivePlanDetails,
  };
}
