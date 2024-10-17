import { useRouter } from 'next/router';
import { modals } from '@mantine/modals';
import { useEffect } from 'react';
import { Skeleton, Stack } from '@mantine/core';

import { SelectCardModal } from '@components/settings';
import { usePlanDetails } from '@hooks/usePlanDetails';
import { CONSTANTS, MODAL_KEYS, ROUTES, colors } from '@config';
import { useAppState } from 'store/app.context';
import { InactiveMembership } from './InactiveMembership';
import { ActivePlanDetails } from './ActivePlanDetails';

export function PlanDetails() {
  const router = useRouter();
  const { profileInfo } = useAppState();
  const { [CONSTANTS.PLAN_CODE_QUERY_KEY]: selectedPlan, [CONSTANTS.EXPLORE_PLANS_QUERY_LEY]: explorePlans } =
    router.query;

  const { activePlanDetails, isActivePlanLoading, showPlans } = usePlanDetails({
    email: profileInfo?.email ?? '',
  });

  console.log(activePlanDetails);

  useEffect(() => {
    if (selectedPlan && profileInfo) {
      modals.open({
        size: '2xl',
        withCloseButton: false,
        id: MODAL_KEYS.SELECT_CARD,
        modalId: MODAL_KEYS.SELECT_CARD,
        children: (
          <SelectCardModal planCode={selectedPlan as string} email={profileInfo.email} onClose={modals.closeAll} />
        ),
      });
      router.push(ROUTES.HOME, {}, { shallow: true });
    } else if (explorePlans) {
      showPlans();
    }
  }, [profileInfo, selectedPlan, router, explorePlans, showPlans]);

  if (isActivePlanLoading) {
    console.log('loading');

    return <Skeleton width="100%" height="200" />;
  }

  let numberOfRecords;
  if (
    Array.isArray(activePlanDetails?.meta.IMPORTED_ROWS) &&
    (activePlanDetails?.meta.IMPORTED_ROWS as unknown as ChargeItem[]).length > 0
  ) {
    numberOfRecords = (activePlanDetails?.meta.IMPORTED_ROWS[0] as unknown as ChargeItem).last_unit;
  } else {
    numberOfRecords = 0;
  }

  let isLessThanZero;
  let showWarning;
  if (activePlanDetails) {
    isLessThanZero =
      typeof activePlanDetails?.meta.IMPORTED_ROWS === 'number' && activePlanDetails?.meta.IMPORTED_ROWS < 0;

    const isOverLimit = activePlanDetails?.usage.IMPORTED_ROWS > numberOfRecords;
    showWarning = isLessThanZero || isOverLimit;
  }

  return (
    <Stack
      p="lg"
      bg={colors.stoneGrey}
      style={{
        borderRadius: '10px',
      }}
    >
      {activePlanDetails ? (
        <ActivePlanDetails
          activePlanDetails={activePlanDetails}
          numberOfRecords={numberOfRecords}
          showPlans={showPlans}
          showWarning={showWarning}
        />
      ) : (
        <InactiveMembership showPlans={showPlans} />
      )}
    </Stack>
  );
}
