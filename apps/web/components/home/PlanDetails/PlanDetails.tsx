import { Alert, Skeleton, Stack, Text, useMantineTheme } from '@mantine/core';

import { colors } from '@config';

import { useAppState } from 'store/app.context';
import { usePlanDetails } from '@hooks/usePlanDetails';

import { ActivePlanDetails } from './ActivePlanDetails';
import { InactiveMembership } from './InactiveMembership';
import { InformationIcon } from '@assets/icons/Information.icon';

import usePlanDetailsStyles from './PlanDetails.styles';

export function PlanDetails() {
  const theme = useMantineTheme();
  const { profileInfo } = useAppState();
  const { classes } = usePlanDetailsStyles();

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
      <Alert
        p="xs"
        icon={<InformationIcon size="md" className={classes.icon} />}
        classNames={{
          root: classes.alert,
          wrapper: classes.wrapper,
          icon: classes.icon,
        }}
      >
        <Text size="sm" weight={400}>
          You&apos;re viewing and managing the details of{' '}
          <Text component="span" weight={900}>
            {profileInfo?.projectName}
          </Text>{' '}
          project
        </Text>
      </Alert>
      <Stack
        p="sm"
        spacing="sm"
        bg={colors.stoneGrey}
        style={{
          borderRadius: theme.radius.xs,
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
    </>
  );
}
