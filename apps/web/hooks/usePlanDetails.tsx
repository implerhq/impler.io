import { useQuery } from '@tanstack/react-query';
import { commonApi } from '@libs/api';
import { API_KEYS, MODAL_KEYS } from '@config';
import { IErrorObject, ISubscriptionData } from '@impler/shared';
import { usePlanMetaData } from 'store/planmeta.store.context';
import { useCallback } from 'react';
import { useAppState } from 'store/app.context';
import { modals } from '@mantine/modals';
import { track } from '@libs/amplitude';
import { PaymentModal } from '@components/AddCard/PaymentModal';
import { IPlanMeta } from '@types';
import React from 'react';
import { useSubOSIntegration } from './useSubOSIntegration';
import { PlansGrid } from 'subos-frontend';

interface UsePlanDetailProps {
  projectId?: string;
  paymentMethodId?: string;
}

export function usePlanDetails({ projectId }: UsePlanDetailProps) {
  const subOSIntegration = useSubOSIntegration();
  console.log('subscription >', subOSIntegration.subscription);
  const { profileInfo } = useAppState();
  const { meta, setPlanMeta } = usePlanMetaData();
  const {
    data: activePlanDetails,
    isLoading: isActivePlanLoading,
    refetch: refetchActivePlanDetails,
  } = useQuery<unknown, IErrorObject, ISubscriptionData, [string | undefined]>(
    [API_KEYS.FETCH_ACTIVE_SUBSCRIPTION],
    () => commonApi<ISubscriptionData>(API_KEYS.FETCH_ACTIVE_SUBSCRIPTION as any, {}),
    {
      onSuccess(data) {
        if (data && data.meta) {
          setPlanMeta({
            ...(data.meta as IPlanMeta),
          });
        }
      },
      enabled: !!projectId,
    }
  );

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
          selectedPlan={null}
          billingCycle="monthly"
          loading={false}
          error={null}
          onPlanSelect={subOSIntegration.selectPlan}
          activePlanCode="current-plan-code"
        />
      ),
      centered: true,
      size: 'calc(50vw - 3rem)',
      withCloseButton: false,
    });
  }, [activePlanDetails, profileInfo, subOSIntegration.plans, subOSIntegration.selectPlan]);

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
    activePlanDetails: subOSIntegration.subscription,
    isActivePlanLoading,
    showPlans,
    onOpenPaymentModal,
    refetchActivePlanDetails,
    // SubOS integration data and methods
    subOSPlans: subOSIntegration.plans,
    subOSLoading: subOSIntegration.loading,
    subOSError: subOSIntegration.error,
    subOSIsConfigured: subOSIntegration.isConfigured,
    subOSBillingCycle: subOSIntegration.billingCycle,
    subOSSelectedPlan: subOSIntegration.selectedPlan,
    subOSChangeBillingCycle: subOSIntegration.changeBillingCycle,
    subOSSelectPlan: subOSIntegration.selectPlan,
    subOSFetchPlans: subOSIntegration.fetchPlans,
  };
}
