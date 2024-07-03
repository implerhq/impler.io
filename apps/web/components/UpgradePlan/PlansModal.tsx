import { Container, Stack, Title } from '@mantine/core';
import React from 'react';
import { Plans } from './Plans';

interface PlanProps {
  userProfile: IProfileData;
  activePlanCode?: string;
  canceledOn?: Date;
  expiryDate?: Date;
}

export const PlansModal = ({ userProfile, activePlanCode, canceledOn, expiryDate }: PlanProps) => {
  return (
    <Container fluid={true}>
      <Stack align="center" justify="center">
        <Title order={2} align="center">
          Choose the plan that works best for you
        </Title>

        <Plans profile={userProfile} activePlanCode={activePlanCode} canceledOn={canceledOn} expiryDate={expiryDate} />
      </Stack>
    </Container>
  );
};
