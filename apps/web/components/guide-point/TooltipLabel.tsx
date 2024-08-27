import React from 'react';
import { Flex, Text } from '@mantine/core';

import { TooltipLink } from './TooltipLink';

interface TooltipLabelProps {
  label: string;
  link: string;
}

export function TooltipLabel({ label, link }: TooltipLabelProps) {
  return (
    <Flex gap="xs">
      <Text>{label}</Text>
      <TooltipLink link={link} />
    </Flex>
  );
}
