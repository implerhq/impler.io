import React from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { TooltipLink } from '@components/guide-point';
import {
  ActionsEnum,
  DATE_FORMATS,
  DOCUMENTATION_REFERENCE_LINKS,
  MODAL_KEYS,
  PLANCODEENUM,
  SubjectsEnum,
} from '@config';
import { ISubscriptionData, numberFormatter } from '@impler/shared';
import { Stack, Group, Divider, Title, Alert } from '@mantine/core';
import { Button } from '@ui/button';
import { PlanDetailCard } from './PlanDetailsCard';
import { useCancelPlan } from '@hooks/useCancelPlan';
import { usePlanDetails } from '@hooks/usePlanDetails';
import { InformationIcon } from '@assets/icons/Information.icon';
import useActivePlanDetailsStyle from './ActivePlanDetails.styles';
import { Can } from 'store/ability.context';

interface ActivePlanDetailsProps {
  activePlanDetails: ISubscriptionData;
  numberOfRecords: number;
  showWarning?: boolean;
  email?: string;
  projectId?: string;
  projectName?: string;
  showPlans: () => void;
}

export function ActivePlanDetails({
  activePlanDetails,
  numberOfRecords,
  showWarning,
  showPlans,
  projectId,
}: ActivePlanDetailsProps) {
  const { classes } = useActivePlanDetailsStyle();
  const { openCancelPlanModal } = useCancelPlan();
  const { onOpenPaymentModal } = usePlanDetails({
    projectId: projectId!,
  });

  return (
    <Stack>
      <Group grow>
        <Title order={3}>{activePlanDetails.plan.name}</Title>
        <Group spacing="sm" position="right">
          <Can I={ActionsEnum.UPDATE} a={SubjectsEnum.CARDS}>
            <Button component={Link} href="/transactions" variant="filled">
              View all transactions
            </Button>
            {!(activePlanDetails.plan.code === PLANCODEENUM.STARTER || activePlanDetails.plan.canceledOn) && (
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
            )}
          </Can>
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

        <Can I={ActionsEnum.BUY} a={SubjectsEnum.PLAN}>
          <Group spacing="xs">
            <Button onClick={showPlans} variant="filled">
              Upgrade Plan
            </Button>

            {activePlanDetails.plan.canceledOn ? (
              <Alert icon={<InformationIcon size="md" />} variant="filled" classNames={classes}>
                Your Plan cancelled on {dayjs(activePlanDetails.plan.canceledOn).format(DATE_FORMATS.LONG)} and Expire
                on {dayjs(activePlanDetails.expiryDate).format(DATE_FORMATS.LONG)}
              </Alert>
            ) : (
              activePlanDetails.plan.code !== PLANCODEENUM.STARTER && (
                <Button
                  color="red"
                  variant="outline"
                  onClick={openCancelPlanModal}
                  leftIcon={<InformationIcon size="md" />}
                >
                  Cancel Plan
                </Button>
              )
            )}

            <TooltipLink link={DOCUMENTATION_REFERENCE_LINKS.subscriptionInformation} iconSize="md" />
          </Group>
        </Can>
      </Stack>
    </Stack>
  );
}
