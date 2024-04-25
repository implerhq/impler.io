import { Container, Stack, Flex, Title } from '@mantine/core';
import React from 'react';
import Plans from './Plans';

interface PlanProps {
  modalTitle: string;
  userProfile: IProfileData;
}

export const PlansModal = ({ modalTitle, userProfile }: PlanProps) => {
  return (
    <Container fluid={true}>
      <Stack align="center">
        <Title order={2} align="center">
          {modalTitle}
        </Title>

        <Flex gap="xl" direction="row" justify="flex-end" align="center" maw="100%">
          <Plans profile={userProfile} />
        </Flex>
      </Stack>
    </Container>
  );
};
