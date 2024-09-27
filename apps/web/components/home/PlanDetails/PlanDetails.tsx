import Link from 'next/link';
import { useRouter } from 'next/router';
import { modals } from '@mantine/modals';
import { useCallback, useContext, useEffect } from 'react';
import { Title, Text, Flex, Button, Skeleton, Stack } from '@mantine/core';

import { track } from '@libs/amplitude';
import { numberFormatter } from '@impler/shared';
import { SelectCardModal } from '@components/settings';
import { usePlanDetails } from '@hooks/usePlanDetails';
import { useApp } from '@hooks/useApp';
import { TooltipLink } from '@components/guide-point';
import { PlansModal } from '@components/UpgradePlan/PlansModal';
import {
  CONSTANTS,
  MODAL_KEYS,
  ROUTES,
  colors,
  DOCUMENTATION_REFERENCE_LINKS,
  ActionsEnum,
  SubjectsEnum,
  AppAbility,
} from '@config';
import { AbilityContext, Can } from 'store/ability.context';

export function PlanDetails() {
  const router = useRouter();

  const { profile } = useApp();
  useContext<AppAbility | null>(AbilityContext);

  const { [CONSTANTS.PLAN_CODE_QUERY_KEY]: selectedPlan, [CONSTANTS.EXPLORE_PLANS_QUERY_LEY]: explorePlans } =
    router.query;

  const { activePlanDetails, isActivePlanLoading } = usePlanDetails({
    projectId: profile?._projectId ?? '',
  });

  const showPlans = useCallback(() => {
    track({
      name: 'VIEW PLANS',
      properties: {},
    });
    modals.open({
      id: MODAL_KEYS.PAYMENT_PLANS,
      modalId: MODAL_KEYS.PAYMENT_PLANS,
      children: (
        <PlansModal
          userProfile={profile!}
          activePlanCode={activePlanDetails?.plan?.code}
          canceledOn={activePlanDetails?.plan.canceledOn}
          expiryDate={activePlanDetails?.expiryDate}
        />
      ),
      size: '2xl',
      withCloseButton: true,
    });
  }, [activePlanDetails, profile]);

  useEffect(() => {
    if (selectedPlan && profile) {
      modals.open({
        size: '2xl',
        withCloseButton: false,
        id: MODAL_KEYS.SELECT_CARD,
        modalId: MODAL_KEYS.SELECT_CARD,
        children: <SelectCardModal planCode={selectedPlan as string} email={profile.email} onClose={modals.closeAll} />,
      });
      router.push(ROUTES.HOME, {}, { shallow: true });
    } else if (explorePlans) {
      showPlans();
    }
  }, [profile, selectedPlan, router, explorePlans, showPlans]);

  if (isActivePlanLoading) return <Skeleton width="100%" height="200" />;

  if (!activePlanDetails)
    return (
      <Stack
        p="sm"
        spacing="xs"
        align="flex-start"
        style={{
          border: `1px solid ${colors.danger}`,
          backgroundColor: colors.danger + '20',
        }}
      >
        <Text>
          You don&apos;t have any active membership. Consider choosing appropriate plan. You can see all transactions{' '}
          <Text inline component={Link} href="/transactions" color={colors.yellow} td="underline">
            here
          </Text>
          .
        </Text>
        <Button onClick={showPlans} color={'red'}>
          Choose Plan
        </Button>
      </Stack>
    );

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
                {'$' + activePlanDetails.plan.charge}
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
            Expiry Date
          </Text>
        </Flex>

        <Can I={ActionsEnum.BUY} a={SubjectsEnum.PLAN}>
          <Flex direction="column" gap={5} align="center">
            <Button
              onClick={showPlans}
              color={isLessThanZero || activePlanDetails.usage.IMPORTED_ROWS > numberOfRecords ? 'red' : 'blue'}
            >
              Choose Plan
            </Button>
            <Text component={Link} href="/transactions" color={colors.yellow} td="underline">
              View all transactions
            </Text>
          </Flex>
        </Can>
      </Flex>

      <TooltipLink link={DOCUMENTATION_REFERENCE_LINKS.subscriptionInformation} iconSize="md" />
    </Flex>
  );
}
