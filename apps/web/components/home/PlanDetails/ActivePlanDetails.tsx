import { TooltipLink } from '@components/guide-point';
import { DOCUMENTATION_REFERENCE_LINKS, MODAL_KEYS, PLANCODEENUM } from '@config';
import { ISubscriptionData, numberFormatter } from '@impler/shared';
import { Stack, Group, Divider, Title } from '@mantine/core';
import { Button } from '@ui/button';
import Link from 'next/link';
import React from 'react';
import { PlanDetailCard } from './PlanDetailsCard';
import { useCancelPlan } from '@hooks/useCancelPlan';
import { usePlanDetails } from '@hooks/usePlanDetails';

interface ActivePlanDetailsProps {
  activePlanDetails: ISubscriptionData;
  numberOfRecords: number;
  showWarning?: boolean;
  email?: string;
  projectId?: string;
  showPlans: () => void;
}

export function ActivePlanDetails({
  activePlanDetails,
  numberOfRecords,
  showWarning,
  showPlans,
  email,
  projectId,
}: ActivePlanDetailsProps) {
  const { openCancelPlanModal } = useCancelPlan({ email: email as string });
  const { onOpenPaymentModal } = usePlanDetails({
    projectId: projectId!,
  });
  const openCancelModal = () => openCancelPlanModal();

  return (
    <Stack>
      <Group grow>
        <Title order={4}>{activePlanDetails.plan.name}</Title>
        <Group spacing="sm" position="right">
          <Button component={Link} href="/transactions" variant="filled">
            View all transactions
          </Button>
          {!(activePlanDetails.plan.code === PLANCODEENUM.STARTER || activePlanDetails.plan.canceledOn) ? (
            <Button
              onClick={() => {
                onOpenPaymentModal({
                  code: activePlanDetails.plan.code,
                  modalId: MODAL_KEYS.CHANGE_CARD,
                });
              }}
              variant="filled"
              color="green"
            >
              Change Card
            </Button>
          ) : null}
        </Group>
      </Group>

      <Divider />
      <Stack spacing="sm">
        <Group grow align="flex-start">
          <PlanDetailCard
            title="Records Imported"
            value={`${numberFormatter(activePlanDetails.usage.IMPORTED_ROWS)}/${numberFormatter(numberOfRecords)}`}
            isWarning={showWarning}
          />
          <PlanDetailCard title="Active Plan" value={activePlanDetails.plan.name} />
          {Number(activePlanDetails.plan.charge) > 0 && (
            <PlanDetailCard title="Outstanding Amount" value={`$${activePlanDetails.plan.charge}`} />
          )}
          <PlanDetailCard title="Expiry Date" value={activePlanDetails.expiryDate} />
        </Group>

        <Divider />

        <Group spacing="xs">
          <Button onClick={showPlans} variant="filled">
            Upgrade Plan
          </Button>

          {activePlanDetails?.plan.code != PLANCODEENUM.STARTER && (
            <Button color="red" variant="outline" onClick={openCancelModal}>
              Cancel Plan
            </Button>
          )}

          <TooltipLink link={DOCUMENTATION_REFERENCE_LINKS.subscriptionInformation} iconSize="md" />
        </Group>
      </Stack>
    </Stack>
  );
}
