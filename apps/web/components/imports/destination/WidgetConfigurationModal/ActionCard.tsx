import React from 'react';
import { Card, Stack, Box, Text } from '@mantine/core';
import { useWelcomeConfigureStepModalStyles } from './WelcomeConfigureStepModal.styles';

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
}

export function ActionCard({ icon, title, onClick }: ActionCardProps) {
  const { classes } = useWelcomeConfigureStepModalStyles();

  return (
    <Card padding="lg" className={classes.actionCard} onClick={onClick}>
      <Stack spacing="md">
        <Box className={classes.iconWrapper}>{icon}</Box>
        <Text className={classes.cardTitle}>{title}</Text>
      </Stack>
    </Card>
  );
}
