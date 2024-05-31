import Link from 'next/link';
import { modals } from '@mantine/modals';
import { Title, Text, Flex, Button, Skeleton } from '@mantine/core';

import { useApp } from '@hooks/useApp';
import { MODAL_KEYS, colors } from '@config';
import { usePlanDetails } from '@hooks/usePlanDetails';
import { PlansModal } from '@components/UpgradePlan/PlansModal';
import { numberFormatter } from '@impler/shared/dist/utils/helpers';

export function PlanDetails() {
  const { profile } = useApp();

  const { activePlanDetails, isActivePlanLoading } = usePlanDetails({
    email: profile?.email ?? '',
  });

  if (isActivePlanLoading) return <Skeleton width="100%" height="200" />;

  if (!activePlanDetails) return null;

  let numberOfRecords;
  if (
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

  const onUpgradeButtonClick = () => {
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
  };

  return (
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
      <Flex gap={5} justify="space-between" w="100%">
        <Flex direction="column" gap={5} align="center">
          <Title order={3} fw="bold">
            {numberFormatter(activePlanDetails!.usage.IMPORTED_ROWS)}
            {'/'}
            {numberFormatter(numberOfRecords)}
          </Title>
          <Text size="sm" fw="bold" color={colors.TXTSecondaryDark}>
            Records Imported
          </Text>
        </Flex>
        <Flex direction="column" gap={5} align="center">
          <Title order={3} fw="bold">
            {activePlanDetails.plan.name}
          </Title>
          <Text size="sm" fw="bold" color={colors.TXTSecondaryDark}>
            Active Plan
          </Text>
        </Flex>
        {Number(activePlanDetails.plan.charge) ? (
          <>
            <Flex direction="column" gap={5} align="center">
              <Title order={3} fw="bold">
                {activePlanDetails.plan.charge}
              </Title>
              <Text size="sm" fw="bold" color={colors.TXTSecondaryDark}>
                Outstanding Amount
              </Text>
            </Flex>
          </>
        ) : null}
        <Flex direction="column" gap={5} align="center">
          <Title order={3} fw="bold">
            <>{activePlanDetails!.expiryDate}</>
          </Title>
          <Text size="sm" fw="bold" color={colors.TXTSecondaryDark}>
            Plan Resets
          </Text>
        </Flex>
        <Flex direction="column" gap={5} align="center">
          <Button
            onClick={onUpgradeButtonClick}
            color={isLessThanZero || activePlanDetails.usage.IMPORTED_ROWS > numberOfRecords ? 'red' : 'blue'}
          >
            Upgrade Plan
          </Button>
          <Text component={Link} href="/transactions" color={colors.yellow} td="underline">
            View all transactions
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
