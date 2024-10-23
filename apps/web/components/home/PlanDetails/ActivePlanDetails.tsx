import { TooltipLink } from '@components/guide-point';
import { DOCUMENTATION_REFERENCE_LINKS } from '@config';
import { numberFormatter } from '@impler/shared';
import { Stack, Group, Divider, Title } from '@mantine/core';
import { Button } from '@ui/button';
import Link from 'next/link';
import React from 'react';
import { PlanDetailCard } from './PlanDetailsCard';
import { useCancelPlan } from '@hooks/useCancelPlan';

interface ActivePlanDetailsProps {
  activePlanDetails: any;
  numberOfRecords: number;
  showWarning?: boolean;
  email?: string;
  showPlans: () => void;
}

export function ActivePlanDetails({
  activePlanDetails,
  numberOfRecords,
  showWarning,
  showPlans,
  email,
}: ActivePlanDetailsProps) {
  const { openCancelPlanModal } = useCancelPlan({ email: email as string });
  const openCancelModal = () => openCancelPlanModal();

  return (
    <Stack>
      <Group grow>
        <Title order={4}>{activePlanDetails.plan.name}</Title>
        <Group spacing="sm" position="right">
          <Button component={Link} href="/transactions" variant="filled">
            View all transactions
          </Button>
          <Button variant="filled" color="green">
            Change Card
          </Button>
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

          {activePlanDetails?.plan.code != 'STARTER' && (
            <Button variant="outline" onClick={openCancelModal}>
              Cancel Plan
            </Button>
          )}

          <TooltipLink link={DOCUMENTATION_REFERENCE_LINKS.subscriptionInformation} iconSize="md" />
        </Group>
      </Stack>
    </Stack>
  );
}
