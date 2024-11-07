import { useQuery } from '@tanstack/react-query';
import { commonApi } from '@libs/api';
import { API_KEYS, MODAL_KEYS } from '@config';
import { IErrorObject, ISubscriptionData } from '@impler/shared';
import { usePlanMetaData } from 'store/planmeta.store.context';
import { useCallback } from 'react';
import { PlansModal } from '@components/UpgradePlan/PlansModal';
import { useAppState } from 'store/app.context';
import { modals } from '@mantine/modals';
import { track } from '@libs/amplitude';
import { PaymentModal } from '@components/AddCard/PaymentModal';
import { Center } from '@mantine/core';
import { IPlanMeta } from '@types';

interface UsePlanDetailProps {
  projectId?: string;
  paymentMethodId?: string;
}

export function usePlanDetails({ projectId }: UsePlanDetailProps) {
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
        <Center>
          <PlansModal
            userProfile={profileInfo!}
            activePlanCode={activePlanDetails?.plan?.code}
            canceledOn={activePlanDetails?.plan.canceledOn}
            expiryDate={activePlanDetails?.expiryDate}
          />
        </Center>
      ),
      centered: true,
      size: 'calc(60vw - 3rem)',
      withCloseButton: true,
    });
  }, [activePlanDetails, profileInfo]);

  const onOpenPaymentModal = ({ code, modalId }: { code: string; modalId: string }) => {
    modals.open({
      size: 'calc(70vw - 40px)',
      withCloseButton: false,
      id: MODAL_KEYS.SELECT_CARD,
      modalId: MODAL_KEYS.SELECT_CARD,
      centered: true,
      children: (
        <PaymentModal
          email={profileInfo!.email}
          planCode={code}
          projectId={profileInfo!._projectId}
          onClose={modals.closeAll}
          modalId={modalId}
        />
      ),
    });
  };

  return {
    meta,
    activePlanDetails,
    isActivePlanLoading,
    showPlans,
    onOpenPaymentModal,
    refetchActivePlanDetails,
  };
}
