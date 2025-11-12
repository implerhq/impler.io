import { Alert, Skeleton, Stack, Text, useMantineTheme } from '@mantine/core';
import { colors, NOTIFICATION_KEYS } from '@config';

import { useAppState } from 'store/app.context';
import { useActiveSubscriptionDetails } from '@hooks/useActiveSubscriptionDetails';

import { InactiveMembership } from './InactiveMembership';
import { ActiveSubscriptionDetails } from './ActiveSubscriptionDetails';
import { InformationIcon } from '@assets/icons/Information.icon';

import usePlanDetailsStyles from './PlanDetails.styles';
import { useEffect } from 'react';
import { notify } from '@libs/notify';

export function PlanDetails() {
  const theme = useMantineTheme();
  const { profileInfo } = useAppState();
  const { classes } = usePlanDetailsStyles();

  const { activePlanDetails, isActivePlanLoading, subscriptionError } = useActiveSubscriptionDetails({
    projectId: profileInfo?._projectId ?? '',
  });
  const numberOfAllocatedRowsInCurrentPlan = activePlanDetails?.meta?.ROWS ?? 0;

  useEffect(() => {
    if (subscriptionError) {
      notify(NOTIFICATION_KEYS.ERROR_FETCHING_SUBSCRIPTION_DETAILS, {
        message: String(subscriptionError),
        color: 'red',
      });
    }
  }, [subscriptionError]);

  if (isActivePlanLoading) {
    return <Skeleton width="100%" height="200" />;
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
          <ActiveSubscriptionDetails
            activePlanDetails={activePlanDetails}
            numberOfAllocatedRowsInCurrentPlan={numberOfAllocatedRowsInCurrentPlan}
            showWarning={(activePlanDetails.usage?.ROWS ?? 0) >= numberOfAllocatedRowsInCurrentPlan}
          />
        ) : (
          <InactiveMembership />
        )}
      </Stack>
    </>
  );
}
