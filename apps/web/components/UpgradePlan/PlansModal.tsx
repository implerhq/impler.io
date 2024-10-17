import { Container, Stack, Title } from '@mantine/core';
import React from 'react';
import { Plans } from './Plans';

interface PlanProps {
  userProfile: IProfileData;
  activePlanCode?: string;
  canceledOn?: string;
  expiryDate?: string;
}

export const PlansModal = ({ userProfile, activePlanCode }: PlanProps) => {
  return (
    <Container fluid={true}>
      <Stack align="center" justify="center">
        <Title order={2} align="center">
          Choose the plan that works best for you
        </Title>

        <Plans email={userProfile.email} activePlanCode={activePlanCode as string} />
      </Stack>
    </Container>
  );
};
