import React from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { Stack, Group, Text, ActionIcon, Menu } from '@mantine/core';

import { ActionsEnum, colors, DATE_FORMATS, PLANCODEENUM, SubjectsEnum } from '@config';
import { ISubscriptionData, numberFormatter } from '@impler/shared';

import { useCancelPlan } from '@hooks/useCancelPlan';
import { Can } from 'store/ability.context';
import { useCustomerPortal } from 'subos-frontend';
import { useAppState } from 'store/app.context';
import { ThreeDotsVerticalIcon } from '@assets/icons/ThreeDotsVertical.icon';
import { ViewTransactionIcon } from '@assets/icons/ViewTransaction.icon';
import { CloseIcon } from '@assets/icons/Close.icon';
import { PaymentCardIcon } from '@assets/icons/PaymentCard.icon';
import { PlanDetailCard } from './PlanDetailsCard';

interface ActivePlanDetailsProps {
  activePlanDetails: ISubscriptionData;
  numberOfAllocatedRowsInCurrentPlan: number;
  showWarning?: boolean;
}

export function ActivePlanDetails({
  activePlanDetails,
  numberOfAllocatedRowsInCurrentPlan,
  showWarning,
}: ActivePlanDetailsProps) {
  const { profileInfo } = useAppState();
  const { openCustomerPortal } = useCustomerPortal();
  const { openCancelPlanModal } = useCancelPlan();

  const currentUsedTeamMembers = Math.max(0, activePlanDetails.usage?.TEAM_MEMBERS || 0);
  const allocatedTeamMembers = Math.max(0, (activePlanDetails.meta?.TEAM_MEMBERS || 0) - 1);
  const isTeamMemberLimitReached = currentUsedTeamMembers >= allocatedTeamMembers;

  return (
    <Stack spacing={0}>
      <Group position="apart" align="center" mb="lg">
        <Group spacing={8}>
          <Text size="lg" weight={700}>
            Your Plan - {activePlanDetails.plan.name} will
          </Text>
          <Text size="lg" color="dimmed">
            (Expire on {dayjs(activePlanDetails.expiryDate).format(DATE_FORMATS.LONG)})
          </Text>
        </Group>

        <Menu position="bottom-end" shadow="md" width={240}>
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray" size="lg" style={{ color: '#9ca3af' }}>
              <ThreeDotsVerticalIcon size="sm" />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Can I={ActionsEnum.UPDATE} a={SubjectsEnum.CARDS}>
              <Menu.Item
                component={Link}
                href="/transactions"
                icon={<ViewTransactionIcon />}
                style={{ color: colors.StrokeLight }}
              >
                View All Transactions
              </Menu.Item>
            </Can>

            <Can I={ActionsEnum.UPDATE} a={SubjectsEnum.CARDS}>
              <Menu.Item
                onClick={() => openCustomerPortal(profileInfo!.email!)}
                icon={<PaymentCardIcon />}
                style={{ color: colors.StrokeLight }}
              >
                Change Card
              </Menu.Item>
            </Can>

            <Can I={ActionsEnum.BUY} a={SubjectsEnum.PLAN}>
              {!activePlanDetails.plan.canceledOn && activePlanDetails.plan.code !== PLANCODEENUM.STARTER && (
                <Menu.Item
                  color="red"
                  icon={<CloseIcon />}
                  onClick={openCancelPlanModal}
                  style={{ color: colors.danger }}
                >
                  Cancel Subscription
                </Menu.Item>
              )}
            </Can>
          </Menu.Dropdown>
        </Menu>
      </Group>

      <Stack spacing="sm">
        <Group grow align="flex-start">
          <PlanDetailCard
            title="Records Imported"
            value={`${activePlanDetails.usage.ROWS}/${numberFormatter(numberOfAllocatedRowsInCurrentPlan)}`}
            isWarning={showWarning}
          />
          <PlanDetailCard
            title="Team Members"
            value={`${currentUsedTeamMembers}/${allocatedTeamMembers}`}
            isWarning={isTeamMemberLimitReached}
          />
          <PlanDetailCard title="Active Plan" value={activePlanDetails.plan.name} />
          {Number(activePlanDetails.plan.charge) > 0 && (
            <PlanDetailCard title="Outstanding Amount" value={`$${activePlanDetails.plan.charge}`} />
          )}
          <PlanDetailCard title="Expiry Date" value={dayjs(activePlanDetails.expiryDate).format(DATE_FORMATS.LONG)} />
        </Group>
      </Stack>

      {activePlanDetails.plan.canceledOn && (
        <Text size="sm" color="yellow" mt="md" style={{ fontStyle: 'italic' }}>
          Your Plan cancelled on {dayjs(activePlanDetails.plan.canceledOn).format(DATE_FORMATS.LONG)} and will expire on{' '}
          {dayjs(activePlanDetails.expiryDate).format(DATE_FORMATS.LONG)}
        </Text>
      )}
    </Stack>
  );
}
