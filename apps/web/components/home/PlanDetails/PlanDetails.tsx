import { Skeleton, Stack } from '@mantine/core';

import { usePlanDetails } from '@hooks/usePlanDetails';
import { AppAbility, colors } from '@config';
import { useAppState } from 'store/app.context';
import { InactiveMembership } from './InactiveMembership';
import { ActivePlanDetails } from './ActivePlanDetails';
import { PlanCancelled } from './PlanCancelled';
import { useContext } from 'react';
import { AbilityContext } from 'store/ability.context';

export function PlanDetails() {
  const { profileInfo } = useAppState();
  useContext<AppAbility | null>(AbilityContext);

  const { activePlanDetails, isActivePlanLoading, showPlans } = usePlanDetails({
    projectId: profileInfo?._projectId ?? '',
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
      p="sm"
      spacing="sm"
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
          projectId={profileInfo?._projectId}
        />
      ) : (
        <InactiveMembership showPlans={showPlans} />
      )}
    </Stack>
  );
}
