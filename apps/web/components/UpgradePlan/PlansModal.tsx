import { Container, Stack, Title } from '@mantine/core';
import React from 'react';
import { Plans } from './Plans';

interface PlanProps {
  userProfile: IProfileData;
  activePlanCode?: string;
}

export const PlansModal = ({ userProfile, activePlanCode }: PlanProps) => {
  return (
    <Container fluid={true}>
      <Stack align="center">
        <Title order={2} align="center">
          Choose the plan that works best for you
        </Title>

        <Plans profile={userProfile} activePlanCode={activePlanCode} />
      </Stack>
    </Container>
  );
};
