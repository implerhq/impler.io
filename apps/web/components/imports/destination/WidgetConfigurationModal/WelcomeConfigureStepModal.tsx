import React from 'react';
import { Stack, Title, Text, Box, Container, SimpleGrid } from '@mantine/core';
import { ImporterIcon, IntegrationStepIcon, TeamIcon } from '@assets/icons';
import { SetupDestinationIcon } from '@assets/icons/SetupDestination.icon';
import { useWelcomeConfigureStepModalStyles } from './WelcomeConfigureStepModal.styles';
import { ActionCard } from './ActionCard';

export enum WelcomeConfigureStepModalActionEnum {
  SetupDestination = 'setupDestination',
  CreateImporter = 'createImporter',
  EmbedIntoYourApplication = 'embedIntoYourApplication',
  TalkWithTeam = 'talkWithTeam',
}

interface IWelcomeConfigureStepModalProps {
  onConfigureDestinationClicked: (action: WelcomeConfigureStepModalActionEnum) => void;
  templateId?: string;
}

export function WelcomeConfigureStepModal({ onConfigureDestinationClicked }: IWelcomeConfigureStepModalProps) {
  const { classes } = useWelcomeConfigureStepModalStyles();

  return (
    <Container size="md" className={classes.container}>
      <Stack spacing="md">
        <Box className={classes.heroBanner}>
          <Title order={1} size="h1" className={classes.heroTitle}>
            That&apos;s how the Importer feels! 🚀
          </Title>
          <Text className={classes.heroText} mb="xs">
            You just experienced the power of a pluggable, readymade importer — smooth, fast, and fully embeddable into
            your own product.
          </Text>
          <Text className={classes.heroText}>
            The best part? You can integrate it in less time than finishing your coffee. ☕
          </Text>
        </Box>

        <Box>
          <Text className={classes.sectionTitle}>Here&apos;s what you can do next 👇</Text>

          <SimpleGrid cols={2} spacing="md" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
            <ActionCard
              title="Setup Destination"
              onClick={() => onConfigureDestinationClicked(WelcomeConfigureStepModalActionEnum.SetupDestination)}
              icon={<SetupDestinationIcon size="xl" color="white" />}
            />

            <ActionCard
              title="Create New Importer"
              onClick={() => onConfigureDestinationClicked(WelcomeConfigureStepModalActionEnum.CreateImporter)}
              icon={<ImporterIcon color="white" />}
            />

            <ActionCard
              title="Embed into your App"
              onClick={() =>
                onConfigureDestinationClicked(WelcomeConfigureStepModalActionEnum.EmbedIntoYourApplication)
              }
              icon={<IntegrationStepIcon color="white" />}
            />

            <ActionCard
              title="Talk With The Team."
              onClick={() => onConfigureDestinationClicked(WelcomeConfigureStepModalActionEnum.TalkWithTeam)}
              icon={<TeamIcon color="white" />}
            />
          </SimpleGrid>
        </Box>
      </Stack>
    </Container>
  );
}
