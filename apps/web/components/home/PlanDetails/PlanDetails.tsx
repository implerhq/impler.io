import { Skeleton, Stack } from '@mantine/core';

import { usePlanDetails } from '@hooks/usePlanDetails';
import { colors } from '@config';
import { useAppState } from 'store/app.context';
import { InactiveMembership } from './InactiveMembership';
import { ActivePlanDetails } from './ActivePlanDetails';
import { PlanCancelled } from './PlanCancelled';

export function PlanDetails() {
  const { profileInfo } = useAppState();

  const { activePlanDetails, isActivePlanLoading, showPlans } = usePlanDetails({
    email: profileInfo?.email ?? '',
  });

  if (isActivePlanLoading) {
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
      {activePlanDetails?.plan.canceledOn ? (
        <PlanCancelled
          cancellationDate={activePlanDetails.plan.canceledOn}
          expiryDate={activePlanDetails.expiryDate}
          planName={activePlanDetails.plan.name}
          showPlans={showPlans}
        />
      ) : activePlanDetails ? (
        <ActivePlanDetails
          activePlanDetails={activePlanDetails}
          numberOfRecords={numberOfRecords}
          showPlans={showPlans}
          showWarning={showWarning}
          email={profileInfo?.email}
        />
      ) : (
        <InactiveMembership showPlans={showPlans} />
      )}
    </Stack>
  );
}
