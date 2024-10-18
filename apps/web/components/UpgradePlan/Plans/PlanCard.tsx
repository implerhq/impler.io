import React from 'react';
import { Card, Text, Badge, Stack, Divider } from '@mantine/core';
import { modals } from '@mantine/modals';
import { PlanFeature } from './PlanFeature';
import { Plan } from './Plans';
import useStyles from './Plans.styles';
import { Button } from '@ui/button';
import { colors, MODAL_KEYS } from '@config';
import { SelectCardModal } from '@components/AddCard/SelectCardModalContent';

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
      size: 'calc(70vw - 40px)',
      withCloseButton: false,
      id: MODAL_KEYS.SELECT_CARD,
      modalId: MODAL_KEYS.SELECT_CARD,
      centered: true,
      styles: {
        body: {
          padding: 0,
        },
      },
      children: <SelectCardModal email={email} planCode={code} onClose={modals.closeAll} />,
    });
  };

  return (
    <Card
      shadow="sm"
      withBorder
      bg={plan.name === 'Growth' ? colors.faintGrey : 'black'}
      style={{ width: '340px', position: 'relative' }}
    >
      <Stack mt="sm">
        {plan.name === 'Growth' && (
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
          onClick={() => onPlanButtonClick(plan.code)}
          disabled={activePlanCode === plan.code || plan.code === 'STARTER'}
        >
          {activePlanCode === plan.code ? 'Active Plan' : 'Choose Plan'}
        </Button>
        <Divider />
      </Stack>
      <Stack spacing={4}>
        <Divider />
        {Object.entries(plan.content).map(([category, items], categoryIndex) => (
          <React.Fragment key={category}>
            {category !== 'Features' && <Text>{category}</Text>}
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
