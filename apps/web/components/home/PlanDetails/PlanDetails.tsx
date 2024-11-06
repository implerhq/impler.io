import { Alert, Skeleton, Stack, Text } from '@mantine/core';

import { usePlanDetails } from '@hooks/usePlanDetails';
import { useAppState } from 'store/app.context';
import { InactiveMembership } from './InactiveMembership';
import { ActivePlanDetails } from './ActivePlanDetails';
import { InformationIcon } from '@assets/icons/Information.icon';
import { useAlertStyles } from './PlanDetails.styles';
import { colors } from '@config';

export function PlanDetails() {
  const { classes } = useAlertStyles();
  const { profileInfo } = useAppState();

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
    <>
      <Stack
        p="sm"
        spacing="sm"
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
            projectId={profileInfo?._projectId}
            projectName={profileInfo?.projectName}
          />
        ) : (
          <InactiveMembership showPlans={showPlans} />
        )}
      </Stack>
      <Alert
        icon={<InformationIcon size="md" className={classes.icon} />}
        classNames={{
          root: classes.alert,
          wrapper: classes.wrapper,
          icon: classes.icon,
          message: classes.message,
        }}
      >
        <Text className={classes.message}>
          You&apos;re viewing details of{' '}
          <Text component="span" weight={700}>
            {profileInfo?.projectName}
          </Text>{' '}
          project
        </Text>
      </Alert>
    </>
  );
}
