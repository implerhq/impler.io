import React from 'react';
import { Card, Text, Badge, Stack, Divider } from '@mantine/core';
import { modals } from '@mantine/modals';
import { PlanFeature } from './PlanFeature';
import { SelectCardModal } from '@components/settings';
import { Plan } from './Plans';
import { Button } from '@ui/button';
import useStyles from './Plans.styles';

interface PlanCardProps {
  plan: Plan;
  isYearly: boolean;
  activePlanCode: string;
  email: string;
}

export function PlanCard({ plan, isYearly, activePlanCode, email }: PlanCardProps) {
  const { classes } = useStyles();

  const onPlanButtonClick = (code: string) => {
    modals.open({
      size: '2xl',
      withCloseButton: false,
      id: 'select-card',
      modalId: 'select-card',
      children: <SelectCardModal email={email} planCode={code} onClose={modals.closeAll} />,
    });
  };

  return (
    <Card
      shadow="sm"
      withBorder
      bg={plan.name === 'Growth' ? 'gray.100' : 'black'}
      style={{ width: '400px', position: 'relative' }}
    >
      {plan.name === 'Growth' && (
        <Badge color="blue" variant="gradient" className={classes.recommendedBadge}>
          Recommended
        </Badge>
      )}
      <Stack spacing="sm">
        <Text className={classes.planName}>{plan.name}</Text>
        <Text className={classes.planPrice}>
          {plan.price === 0 ? 'Free' : `$${plan.price} / ${isYearly ? 'year' : 'month'}`}
        </Text>
        <Button
          className={classes.button}
          fullWidth
          onClick={() => onPlanButtonClick(plan.code)}
          disabled={activePlanCode === plan.code}
        >
          {activePlanCode === plan.code ? 'Active Plan' : 'Choose Plan'}
        </Button>
        <Divider />
      </Stack>
      <Stack spacing="xs">
        <Divider />
        {Object.entries(plan.content).map(([category, items], categoryIndex) => (
          <React.Fragment key={category}>
            {category !== 'Features' && <Text className={classes.categoryTitle}>{category}:</Text>}
            {items.map(({ check, title }, index) => (
              <PlanFeature key={`${category}-${index}`} included={check} value={title} />
            ))}
            {category !== 'Features' && categoryIndex < Object.keys(plan.content).length - 1 && <Divider my="sm" />}
          </React.Fragment>
        ))}
      </Stack>
    </Card>
  );
}
