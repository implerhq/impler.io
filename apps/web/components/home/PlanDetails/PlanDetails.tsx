import { Alert, Skeleton, Stack, Text, useMantineTheme, Button, Group } from '@mantine/core';

import { colors } from '@config';

import { useAppState } from 'store/app.context';
import { useActiveSubscriptionDetails } from '@hooks/useActiveSubscriptionDetails';

import { InactiveMembership } from './InactiveMembership';
import { ActiveSubscriptionDetails } from './ActiveSubscriptionDetails';
import { InformationIcon } from '@assets/icons/Information.icon';

import usePlanDetailsStyles from './PlanDetails.styles';

export function PlanDetails() {
  const theme = useMantineTheme();
  const { profileInfo } = useAppState();
  const { classes } = usePlanDetailsStyles();

  const { activePlanDetails, isActivePlanLoading, subscriptionError } = useActiveSubscriptionDetails({
    projectId: profileInfo?._projectId ?? '',
  });
  const numberOfAllocatedRowsInCurrentPlan = activePlanDetails?.meta?.ROWS ?? 0;

  if (isActivePlanLoading) {
    return <Skeleton width="100%" height="200" />;
  }

  if (subscriptionError && !activePlanDetails) {
    return (
      <Alert color="red" title="Failed to load subscription details">
        <Stack spacing="sm">
          <Text size="sm">{String(subscriptionError)}</Text>
          <Group spacing="sm">
            <Button size="xs" variant="outline">
              View Plans
            </Button>
          </Group>
        </Stack>
      </Alert>
    );
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
