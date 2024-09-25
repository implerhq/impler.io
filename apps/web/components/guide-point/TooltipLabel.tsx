import React from 'react';
import { Flex, Text } from '@mantine/core';

import useStyles from './TooltipLabel.styles';
import { TooltipLink } from './TooltipLink';

interface TooltipLabelProps {
  label: string;
  link?: string;
}

export function TooltipLabel({ label, link }: TooltipLabelProps) {
  const { classes } = useStyles();

  return (
    <Flex gap="xs">
      <Text className={classes.label} component="label">
        {label}
      </Text>
      {link && <TooltipLink link={link} />}
    </Flex>
  );
}
