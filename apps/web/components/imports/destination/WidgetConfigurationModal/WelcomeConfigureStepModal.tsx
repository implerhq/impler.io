import React from 'react';
import { Stack, Title, Text, Box, Container, SimpleGrid } from '@mantine/core';
import { ImporterIcon, IntegrationStepIcon, TeamIcon } from '@assets/icons';
import { SetupDestinationIcon } from '@assets/icons/SetupDestination.icon';
import { useWelcomeConfigureStepModalStyles } from './WelcomeConfigureStepModal.styles';
import { ActionCard } from './ActionCard';

// Base action type
type BaseAction<T extends string> = {
  type: T;
  /*
   * Add any common action properties here
   * payload?: Record<string, unknown>;
   */
};

// Define individual action types
type SetupDestinationAction = BaseAction<'setupDestination'>;
type CreateImporterAction = BaseAction<'createImporter'>;
type CreateIntegrationStepAction = BaseAction<'createIntegrationStep'>;
type TalkWithTeamAction = BaseAction<'talkWithTeam'>;

// Union of all possible action types
export type ConfigureStepAction =
  | SetupDestinationAction
  | CreateImporterAction
  | CreateIntegrationStepAction
  | TalkWithTeamAction;

// Action creators for better maintainability
export const actionCreators = {
  setupDestination: (): ConfigureStepAction => ({ type: 'setupDestination' }),
  createImporter: (): ConfigureStepAction => ({ type: 'createImporter' }),
  createIntegrationStep: (): ConfigureStepAction => ({
    type: 'createIntegrationStep',
  }),
  talkWithTeam: (): ConfigureStepAction => ({ type: 'talkWithTeam' }),
};

interface IWelcomeConfigureStepModalProps {
  /**
   * Callback function that is called when an action is triggered
   * @param action - The action that was triggered
   */
  onConfigureDestinationClicked: (action: ConfigureStepAction) => void;

  /**
   * Optional template ID for the import configuration
   */
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
              onClick={() => onConfigureDestinationClicked(actionCreators.setupDestination())}
              icon={<SetupDestinationIcon size="xl" color="white" />}
            />

            <ActionCard
              title="Create New Importer"
              onClick={() => onConfigureDestinationClicked(actionCreators.createImporter())}
              icon={<ImporterIcon color="white" />}
            />

            <ActionCard
              title="Create New Integration Step"
              onClick={() => onConfigureDestinationClicked(actionCreators.createIntegrationStep())}
              icon={<IntegrationStepIcon color="white" />}
            />

            <ActionCard
              title="Talk With The Team."
              onClick={() => onConfigureDestinationClicked(actionCreators.talkWithTeam())}
              icon={<TeamIcon color="white" />}
            />
          </SimpleGrid>
        </Box>
      </Stack>
    </Container>
  );
}
