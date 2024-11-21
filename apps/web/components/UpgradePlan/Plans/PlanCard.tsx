import React from 'react';
import { Card, Text, Badge, Stack, Divider } from '@mantine/core';
import { Button } from '@ui/button';
import { colors, MODAL_KEYS, PLANCODEENUM } from '@config';
import { Plan } from './Plans';
import { PlanFeature } from './PlanFeature';
import useStyles from './Plans.styles';
import { usePlanDetails } from '@hooks/usePlanDetails';

interface PlanCardProps {
  plan: Plan;
  isYearly: boolean;
  activePlanCode: string;
  email: string;
  projectId?: string;
}

export function PlanCard({ plan, isYearly, activePlanCode, projectId }: PlanCardProps) {
  const { classes } = useStyles();
  const { onOpenPaymentModal } = usePlanDetails({ projectId });

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
          onClick={() => onOpenPaymentModal({ code: plan.code, modalId: MODAL_KEYS.SELECT_CARD })}
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
