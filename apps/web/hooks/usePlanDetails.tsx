import { useQuery } from '@tanstack/react-query';
import { commonApi } from '@libs/api';
import { API_KEYS, MODAL_KEYS } from '@config';
import { IErrorObject } from '@impler/shared';
import { usePlanMetaData } from 'store/planmeta.store.context';
import { useCallback } from 'react';
import { PlansModal } from '@components/UpgradePlan/PlansModal';
import { useAppState } from 'store/app.context';
import { modals } from '@mantine/modals';
import { track } from '@libs/amplitude';
import { SelectCardModal } from '@components/AddCard/SelectCardModalContent';

interface UsePlanDetailProps {
  email: string;
}

export function usePlanDetails({ email }: UsePlanDetailProps) {
  const { profileInfo } = useAppState();
  const { meta, setPlanMeta } = usePlanMetaData();
  const { data: activePlanDetails, isLoading: isActivePlanLoading } = useQuery<
    unknown,
    IErrorObject,
    ISubscriptionData,
    [string, string]
  >(
    [API_KEYS.FETCH_ACTIVE_SUBSCRIPTION, email],
    () => commonApi<ISubscriptionData>(API_KEYS.FETCH_ACTIVE_SUBSCRIPTION as any, {}),
    {
      onSuccess(data) {
        if (data && data.meta) {
          setPlanMeta({
            AUTOMATIC_IMPORTS: data.meta.AUTOMATIC_IMPORTS,
            IMAGE_UPLOAD: data.meta.IMAGE_UPLOAD,
            IMPORTED_ROWS: data.meta.IMPORTED_ROWS,
            REMOVE_BRANDING: data.meta.REMOVE_BRANDING,
            ADVANCED_VALIDATORS: data.meta.ADVANCED_VALIDATORS,
          });
        }
      },
      enabled: !!email,
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
        <PlansModal
          userProfile={profileInfo!}
          activePlanCode={activePlanDetails?.plan?.code}
          canceledOn={activePlanDetails?.plan.canceledOn}
          expiryDate={activePlanDetails?.expiryDate}
        />
      ),
      size: 'calc(60vw - 3rem)',
      withCloseButton: true,
    });
  }, [activePlanDetails, profileInfo]);

  const onChoosePlanButtonClick = (code: string) => {
    modals.open({
      size: 'calc(70vw - 40px)',
      withCloseButton: false,
      id: MODAL_KEYS.SELECT_CARD,
      modalId: MODAL_KEYS.SELECT_CARD,
      centered: true,
      styles: {
        body: {
          padding: 0,
        },
      },
      children: <SelectCardModal email={email} planCode={code} onClose={modals.closeAll} />,
    });
  };

  return {
    meta,
    activePlanDetails,
    isActivePlanLoading,
    showPlans,
    onChoosePlanButtonClick,
  };
}
