import { colors } from '@config';
import { Title, Text, Stack, Flex, Button, Skeleton } from '@mantine/core';
import { PlansModal } from '@components/plans-modal/PlansModal';
import { modals } from '@mantine/modals';
import { useApp } from '@hooks/useApp';
import { usePlanDetails } from '@hooks/usePlanDetails';

export function PlanDetails() {
  const { profile } = useApp();

  const { activePlanDetails, isActivePlanLoading } = usePlanDetails({
    email: profile?.email ?? '',
  });

  if (isActivePlanLoading) return <Skeleton width="100%" height="200" />;

  let numberOfRecords;
  if (typeof activePlanDetails?.meta.IMPORTED_ROWS === 'number') {
    numberOfRecords = activePlanDetails?.meta.IMPORTED_ROWS;
  } else if (
    Array.isArray(activePlanDetails?.meta.IMPORTED_ROWS) &&
    (activePlanDetails?.meta.IMPORTED_ROWS as unknown as ChargeItem[]).length > 0
  ) {
    numberOfRecords = (activePlanDetails?.meta.IMPORTED_ROWS[0] as unknown as ChargeItem).last_unit;
  } else {
    numberOfRecords = 0;
  }

  return (
    <Flex
      p="sm"
      gap="sm"
      direction="row"
      align="center"
      style={{ border: `1px solid ${colors.yellow}`, backgroundColor: colors.yellow + '20' }}
    >
      <Stack spacing="xs" style={{ flexGrow: 1 }}>
        <Title order={4}>Usage</Title>
        {typeof activePlanDetails!.usage.IMPORTED_ROWS === 'number' ? (
          <Text>
            You have imported {activePlanDetails!.usage.IMPORTED_ROWS} of {numberOfRecords} records this month on the{' '}
            {activePlanDetails?.plan.name} Plan (Resets on {activePlanDetails!.expiryDate})
          </Text>
        ) : (
          <Text>
            You have imported {activePlanDetails!.meta.IMPORTED_ROWS} of {numberOfRecords} records this month on the{' '}
            {activePlanDetails?.plan.name} Plan (Resets on {activePlanDetails!.expiryDate})
          </Text>
        )}
      </Stack>
      <Button
        onClick={() => {
          modals.open({
            children: <PlansModal modalTitle={'Choose Your Plan'} userProfile={profile!} />,
            size: 'xl',
          });
        }}
        color="yellow"
      >
        Upgrade Plan
      </Button>
    </Flex>
  );
}
