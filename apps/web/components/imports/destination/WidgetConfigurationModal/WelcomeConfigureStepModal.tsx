import React from 'react';
import { Stack, Title, Text, Box, Container } from '@mantine/core';
import { useStyles } from './WelcomeImporterModal.styles';
import { Button } from '@ui/button';
import Lottie from 'lottie-react';
import SuccessConfetti from './confetti_on_transparent_background.json';
import TickConfetti from './success_confetti.json';

interface IWelcomeConfigureStepModalProps {
  onConfigureDestinationClicked: () => void;
  templateId?: string;
}

export function WelcomeConfigureStepModal({ onConfigureDestinationClicked }: IWelcomeConfigureStepModalProps) {
  const { classes } = useStyles();

  return (
    <Container>
      <Box>
        <Box className={classes.animationWrapper}>
          <Lottie animationData={SuccessConfetti} loop={true} />
          <Box className={classes.iconWrapper}>
            <Box className={classes.iconContainer}>
              <Lottie animationData={TickConfetti} loop={true} className={classes.animation} />
            </Box>
          </Box>
        </Box>
      </Box>
      <Stack align="center">
        <Title align="center" color="white" order={1}>
          Great!
        </Title>

        <Text align="center">
          You’ve imported data successfully - next, choose where to receive your imported data?{' '}
        </Text>

        <Button fullWidth onClick={onConfigureDestinationClicked} loading={false}>
          Configure destination
        </Button>
      </Stack>
    </Container>
  );
}
