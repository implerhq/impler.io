import React from 'react';
import { Flex, Text } from '@mantine/core';
import { CheckCircle } from '@assets/icons/CheckCircle.icon';
import { CrossCircle } from '@assets/icons/CrossCircle.icon';
import { TooltipLink } from '@components/guide-point';

interface PlanFeatureProps {
  included: boolean;
  value?: string;
  tooltipLink?: string;
}

export function PlanFeature({ included, value = '', tooltipLink }: PlanFeatureProps) {
  return (
    <Flex align="center" gap="xs">
      {included ? <CheckCircle /> : <CrossCircle />}
      <Text fw="bolder">{value}</Text>
      {tooltipLink && <TooltipLink link={tooltipLink} iconSize="md" />}
    </Flex>
  );
}
