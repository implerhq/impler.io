import React from 'react';
import { Stack, Title, Text, Box, Container, Anchor, Flex } from '@mantine/core';
import { useStyles } from './WelcomeImporterModal.styles';
import { Button } from '@ui/button';
import Lottie from 'lottie-react';
import SuccessConfetti from './static-assets/confetti_on_transparent_background.json';
import TickConfetti from './static-assets/success_confetti.json';
import Link from 'next/link';
import { CONSTANTS } from '@config';
import { useImports } from '@hooks/useImports';
import { modals } from '@mantine/modals';

interface IWelcomeImporterModalProps {
  onDoWelcomeWidgetAction: () => void;
}

export function WelcomeImporterModal({ onDoWelcomeWidgetAction }: IWelcomeImporterModalProps) {
  const { classes } = useStyles();
  const { handleDownloadSample } = useImports();

  return (
    <Container>
      <Box className={classes.animationContainer}>
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
          Welcome to your new importer!
        </Title>
        <Text align="center">
          You can give it a quick try and see how it works - no setup required. Download the
          <br />
          <Anchor onClick={handleDownloadSample} underline={true} fw={700} c="yellow" fz="md">
            Demo File!
          </Anchor>
        </Text>
        <Text color="dimmed">Need help embedding your first importer?</Text>
        <Link target="_blank" href={CONSTANTS.IMPLER_CAL_QUICK_MEETING}>
          Book a 15-min onboarding call
        </Link>
        <Flex w="100%" gap="md" mt="md">
          <Button fullWidth onClick={onDoWelcomeWidgetAction} loading={false}>
            Give it a try
          </Button>
          <Button fullWidth variant="outline" onClick={modals.closeAll} loading={false}>
            Close
          </Button>
        </Flex>
      </Stack>
    </Container>
  );
}
