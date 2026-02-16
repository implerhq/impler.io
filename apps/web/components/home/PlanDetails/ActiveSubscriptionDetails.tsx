import React from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { useCustomerPortal } from 'subos-frontend';
import { Stack, Group, ActionIcon, Menu, Alert } from '@mantine/core';

import { ActionsEnum, colors, DATE_FORMATS, PLANCODEENUM, SubjectsEnum } from '@config';
import { ISubscriptionData, numberFormatter } from '@impler/shared';

import { useCancelPlan } from '@hooks/useCancelPlan';
import { Can } from 'store/ability.context';
import { useAppState } from 'store/app.context';
import { ViewTransactionIcon } from '@assets/icons/ViewTransaction.icon';
import { ThreeDotsVerticalIcon } from '@assets/icons/ThreeDotsVertical.icon';
import { CloseIcon } from '@assets/icons/Close.icon';
import { PaymentCardIcon } from '@assets/icons/PaymentCard.icon';
import { PlanDetailCard } from './PlanDetailsCard';
import { InformationIcon } from '@assets/icons/Information.icon';
import useActiveSubscriptionDetailsStyle from './ActiveSubscriptionDetails.styles';

interface ActivePlanDetailsProps {
  activePlanDetails: ISubscriptionData;
  numberOfAllocatedRowsInCurrentPlan: number;
  showWarning?: boolean;
}

export function ActiveSubscriptionDetails({
  activePlanDetails,
  numberOfAllocatedRowsInCurrentPlan,
  showWarning,
}: ActivePlanDetailsProps) {
  const { classes } = useActiveSubscriptionDetailsStyle();
  const { profileInfo } = useAppState();
  const { openCustomerPortal } = useCustomerPortal();
  const { openCancelPlanModal } = useCancelPlan();

  const teamMembersUsed = activePlanDetails?.usage?.TEAM_MEMBERS || 0;
  const teamMembersAllocated = activePlanDetails?.meta?.TEAM_MEMBERS ? activePlanDetails.meta.TEAM_MEMBERS - 1 : 0;

  let currentUsedTeamMembers: string | number = Math.max(0, teamMembersUsed);
  let allocatedTeamMembers: string | number = Math.max(0, teamMembersAllocated);

  if (allocatedTeamMembers === 0) {
    allocatedTeamMembers = 'NA';
    currentUsedTeamMembers = '0';
  }
  const isTeamMemberLimitReached = Number(currentUsedTeamMembers) >= Number(allocatedTeamMembers);

  return (
    <Stack spacing={0}>
      <Group mb="xs" position="apart">
        <Group spacing={8}></Group>

        <Menu position="bottom-end" shadow="xl" width={240}>
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray" size="lg" style={{ color: '#9ca3af' }}>
              <ThreeDotsVerticalIcon size="xl" color="white" />
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
                Manage Billing
              </Menu.Item>
            </Can>

            <Can I={ActionsEnum.BUY} a={SubjectsEnum.PLAN}>
              {!activePlanDetails?.plan?.canceledOn && activePlanDetails?.plan?.code !== PLANCODEENUM.STARTER && (
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
            value={`${activePlanDetails?.usage?.ROWS ?? 0}/${numberFormatter(numberOfAllocatedRowsInCurrentPlan)}`}
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
        <Alert icon={<InformationIcon size="md" />} variant="filled" classNames={classes}>
          Your Plan cancelled on {dayjs(activePlanDetails.plan.canceledOn).format(DATE_FORMATS.LONG)} and Expire on{' '}
          {dayjs(activePlanDetails.expiryDate).format(DATE_FORMATS.LONG)}
        </Alert>
      )}
    </Stack>
  );
}
