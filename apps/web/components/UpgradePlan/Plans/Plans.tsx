import React, { useState } from 'react';
import { Stack, Text, Group, Badge, Title, Divider, Switch } from '@mantine/core';

import { plans } from '@config';
import { PlanCard } from './PlanCard';

export interface PlanFeatureContent {
  check: boolean;
  title: string;
  tooltipLink?: string;
}

export interface PlanContent {
  [key: string]: PlanFeatureContent[];
}

export interface Plan {
  name: string;
  code: string;
  rowsIncluded: number;
  price: number;
  extraChargeOverheadTenThusandRecords: number;
  removeBranding: boolean;
  content: PlanContent;
}

interface PlansProps {
  activePlanCode: string;
  email: string;
  projectId?: string;
  canceledOn?: string;
  expiryDate?: string;
}

export function Plans({ activePlanCode, email, projectId }: PlansProps) {
  const [showYearly, setShowYearly] = useState(true);

  return (
    <Stack spacing="xs" align="center">
      <Group position="center">
        <Text weight={500} color="white">
          Monthly
        </Text>
        <Switch
          size="sm"
          width="sm"
          checked={showYearly}
          onChange={(event) => setShowYearly(event.currentTarget.checked)}
        />
        <Title size="2xl" weight={900} color="white">
          Yearly
        </Title>
        <Badge variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>
          Save 20% OFF
        </Badge>
      </Group>
      <Divider />
      <Group grow align="flex-start">
        {plans[showYearly ? 'yearly' : 'monthly'].map((plan) => (
          <PlanCard
            key={plan.code}
            plan={plan}
            isYearly={showYearly}
            activePlanCode={activePlanCode}
            email={email}
            projectId={projectId}
          />
        ))}
      </Group>
    </Stack>
  );
}
