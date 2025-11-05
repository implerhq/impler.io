import React from 'react';
import { Card, Text, Badge, Stack, Divider } from '@mantine/core';
import { Button } from '@ui/button';
import { colors, PLANCODEENUM } from '@config';
import { Plan } from './Plans';
import { PlanFeature } from './PlanFeature';
import useStyles from './Plans.styles';
import { useSubOSIntegration } from '@hooks/useSubOSIntegration';

interface PlanCardProps {
  plan: Plan;
  isYearly: boolean;
  activePlanCode: string;
  email: string;
  projectId?: string;
}

type BillingCycle = 'monthly' | 'yearly';
const planBillingCycle: BillingCycle = 'monthly';

const mapToSubOSPlan = (plan: Plan, cycle: BillingCycle): any => {
  return {
    id: plan.code,
    name: plan.name,
    code: plan.code,
    price: plan.price,
    fixedCost: 0,
    paymentMode: 'recurring',
    interval: cycle === 'monthly' ? 'month' : 'year',
    intervalCount: 1,
    currency: 'USD',
    isActive: true,
    isDefault: plan.code === PLANCODEENUM.STARTER,
    metadata: {
      rowsIncluded: plan.rowsIncluded,
      extraChargeOverheadTenThusandRecords: plan.extraChargeOverheadTenThusandRecords,
      removeBranding: plan.removeBranding,
    },
    billingCycle: cycle,
  };
};

export function PlanCard({ plan, isYearly, activePlanCode }: PlanCardProps) {
  const { classes } = useStyles();
  const { selectPlan } = useSubOSIntegration();

  return (
    <Card
      style={{ width: '800px' }}
      shadow="sm"
      withBorder
      bg={
        plan.code === PLANCODEENUM.GROWTH || plan.code === PLANCODEENUM.GROWTH_YEARLY ? colors.faintGrey : colors.black
      }
    >
      <Stack mt="md">
        {(plan.code === PLANCODEENUM.GROWTH || plan.code === PLANCODEENUM.GROWTH_YEARLY) && (
          <Badge color="blue" variant="gradient" className={classes.recommendedBadge}>
            Recommended
          </Badge>
        )}
        <Text className={classes.planName}>{plan.name}</Text>
        <Text className={classes.planPrice}>
          {plan.price === 0 ? 'Free' : `$${plan.price} / ${isYearly ? 'year' : 'month'}`}
        </Text>
        <Button
          className={classes.button}
          fullWidth
          onClick={() => selectPlan(mapToSubOSPlan(plan, planBillingCycle))}
          disabled={plan.code === PLANCODEENUM.STARTER || activePlanCode === plan.code}
        >
          {activePlanCode === plan.code ? 'Active Plan' : 'Choose Plan'}
        </Button>
        <Divider />
      </Stack>
      <Stack spacing={10}>
        <Divider />
        {Object.entries(plan.content).map(([category, items], categoryIndex) => (
          <React.Fragment key={category}>
            {category !== 'Features' && <Text>{category}</Text>}
            {items.map(({ check, title, tooltipLink }, index) => (
              <PlanFeature key={`${category}-${index}`} included={check} value={title} tooltipLink={tooltipLink} />
            ))}
            {category !== 'Features' && categoryIndex < Object.keys(plan.content).length - 1 && <Divider my={5} />}
          </React.Fragment>
        ))}
      </Stack>
    </Card>
  );
}
