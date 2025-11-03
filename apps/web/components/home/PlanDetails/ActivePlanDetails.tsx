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
import { ExternalLinkIcon } from '@assets/icons/ExternalLink.icon';
import { ThreeDotsVerticalIcon } from '@assets/icons/ThreeDotsVertical.icon';
import { ViewTransactionIcon } from '@assets/icons/ViewTransaction.icon';
import { CloseIcon } from '@assets/icons/Close.icon';
import { PaymentCardIcon } from '@assets/icons/PaymentCard.icon';
import { MetricItem } from './MetricItem';

interface ActivePlanDetailsProps {
  activePlanDetails: ISubscriptionData;
  numberOfAllocatedRowsInCurrentPlan: number;
  showWarning?: boolean;
  email?: string;
  projectId?: string;
  projectName?: string;
  showPlans: () => void;
}

export function ActivePlanDetails({
  activePlanDetails,
  numberOfAllocatedRowsInCurrentPlan,
  showWarning,
  showPlans,
}: ActivePlanDetailsProps) {
  const { profileInfo } = useAppState();
  const { openCustomerPortal } = useCustomerPortal();
  const { openCancelPlanModal } = useCancelPlan();

  const rowsValue = `${numberFormatter(activePlanDetails.usage?.IMPORTED_ROWS)}/${numberFormatter(
    numberOfAllocatedRowsInCurrentPlan
  )}`;

  const membersValue = activePlanDetails.meta?.TEAM_MEMBERS
    ? `${activePlanDetails.usage?.TEAM_MEMBERS}/${activePlanDetails.meta?.TEAM_MEMBERS || 'Unlimited'}`
    : 'N/A';

  return (
    <Stack spacing={0}>
      <Group position="apart" align="center" mb="lg">
        <Group spacing={8}>
          <Text size="lg" weight={700}>
            Your Plan
          </Text>
          <Text size="sm" color="dimmed">
            (Expire on {dayjs(activePlanDetails.expiryDate).format(DATE_FORMATS.LONG)})
          </Text>
          <ActionIcon component="a" href="/subscription" target="_blank" size="xs" variant="subtle">
            <ExternalLinkIcon size="xs" />
          </ActionIcon>
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

      {/* Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
          borderTop: '1px solid #374151',
          paddingTop: '20px',
        }}
      >
        <MetricItem
          label="Plan Type"
          value={activePlanDetails.plan.name}
          actionText={
            Number(activePlanDetails.plan.fixedCost) > 0 ? `$${activePlanDetails.plan.fixedCost}/Month` : '$0.00/Month'
          }
          actionColor={colors.white}
        />

        <div style={{ borderLeft: '1px solid #374151', paddingLeft: '24px' }}>
          <MetricItem
            label="Total Members"
            value={membersValue}
            actionText="Add More"
            actionColor={colors.yellow}
            onActionClick={showPlans}
          />
        </div>

        <div style={{ borderLeft: '1px solid #374151', paddingLeft: '24px' }}>
          <MetricItem
            label="Records Imported"
            value={String(`${activePlanDetails.usage.ROWS}/${numberFormatter(numberOfAllocatedRowsInCurrentPlan)}`)}
            actionText="Upgrade for extra records"
            actionColor={showWarning ? colors.danger : colors.yellow}
            onActionClick={showPlans}
          />
        </div>

        <div style={{ borderLeft: '1px solid #374151', paddingLeft: '24px' }}>
          <MetricItem
            label="Rows Included"
            value={rowsValue}
            actionText="Upgrade for extra row"
            actionColor={showWarning ? colors.danger : colors.yellow}
            onActionClick={showPlans}
          />
        </div>
      </div>

      {/* Cancellation Alert */}
      {activePlanDetails.plan.canceledOn && (
        <Text size="sm" color="yellow" mt="md" style={{ fontStyle: 'italic' }}>
          Your Plan cancelled on {dayjs(activePlanDetails.plan.canceledOn).format(DATE_FORMATS.LONG)} and will expire on{' '}
          {dayjs(activePlanDetails.expiryDate).format(DATE_FORMATS.LONG)}
        </Text>
      )}
    </Stack>
  );
}
