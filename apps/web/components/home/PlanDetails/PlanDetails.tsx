/* eslint-disable multiline-comment-style */
import { Alert, Skeleton, Stack, Text, useMantineTheme, Button, Group } from '@mantine/core';

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

  const { activePlanDetails, isActivePlanLoading, subscriptionError } = usePlanDetails({
    projectId: profileInfo?._projectId ?? '',
  });

  if (isActivePlanLoading) {
    return <Skeleton width="100%" height="200" />;
  }

  // Show error state with retry option
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
  const numberOfAllocatedRowsInCurrentPlan = activePlanDetails?.meta.ROWS;

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
            numberOfAllocatedRowsInCurrentPlan={activePlanDetails.meta.ROWS}
            showWarning={activePlanDetails.usage.ROWS >= numberOfAllocatedRowsInCurrentPlan}
          />
        ) : (
          <InactiveMembership />
        )}
      </Stack>
    </>
  );
}
