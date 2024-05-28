import { MODAL_KEYS, colors } from '@config';
import { Title, Text, Stack, Flex, Button, Skeleton, Divider } from '@mantine/core';
import { PlansModal } from '@components/UpgradePlan/PlansModal';
import { modals } from '@mantine/modals';
import { useApp } from '@hooks/useApp';
import { usePlanDetails } from '@hooks/usePlanDetails';

export function PlanDetails() {
  const { profile } = useApp();

  const { activePlanDetails, isActivePlanLoading } = usePlanDetails({
    email: profile?.email ?? '',
  });

  if (!activePlanDetails) return;

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

  const isLessThanZero =
    typeof activePlanDetails?.meta.IMPORTED_ROWS === 'number' && activePlanDetails?.meta.IMPORTED_ROWS < 0;

  // Define background color based on conditions
  const backgroundColor =
    isLessThanZero || activePlanDetails!.usage.IMPORTED_ROWS > numberOfRecords ? colors.danger : colors.yellow;

  if (!activePlanDetails) return null;

  return (
    <>
      <Flex
        p="sm"
        gap="sm"
        direction="row"
        align="center"
        style={{
          border: `1px solid ${
            isLessThanZero || activePlanDetails.usage.IMPORTED_ROWS > numberOfRecords ? colors.danger : colors.yellow
          }`,
          backgroundColor: backgroundColor + '20',
        }}
      >
        <Stack spacing="xs" style={{ flexGrow: 1 }}>
          <Title order={4}>Overall Usage</Title>
          {typeof activePlanDetails?.usage.IMPORTED_ROWS === 'number' ? (
            <Text>
              <>
                You have imported {activePlanDetails!.usage.IMPORTED_ROWS} of {numberOfRecords} records in the{' '}
                {activePlanDetails?.plan.name} Plan (Resets on {activePlanDetails!.expiryDate} ){' '}
                {activePlanDetails?.plan.charge === 0.0
                  ? ` Your total charges are $${activePlanDetails?.plan.charge}.`
                  : ''}
              </>
            </Text>
          ) : (
            <Text>
              <>
                Overall You have left {activePlanDetails!.meta.IMPORTED_ROWS}
                {activePlanDetails?.plan.charges[0].properties.units} records in {activePlanDetails?.plan.name} Plan
                (Resets on {activePlanDetails?.expiryDate})
              </>
            </Text>
          )}
        </Stack>
        <Button
          onClick={() => {
            modals.open({
              id: MODAL_KEYS.PAYMENT_PLANS,
              modalId: MODAL_KEYS.PAYMENT_PLANS,
              children: (
                <PlansModal
                  userProfile={profile!}
                  activePlanCode={activePlanDetails?.plan?.code}
                  canceledOn={activePlanDetails.plan.canceledOn}
                  expiryDate={activePlanDetails.expiryDate}
                />
              ),
              size: '2xl',
              withCloseButton: true,
            });
          }}
          color={isLessThanZero || activePlanDetails.usage.IMPORTED_ROWS > numberOfRecords ? 'red' : 'blue'}
        >
          Upgrade Plan
        </Button>
      </Flex>
      <Divider />
    </>
  );
}
