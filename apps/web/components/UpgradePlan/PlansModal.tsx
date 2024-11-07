import { Flex, Title } from '@mantine/core';
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
    <Flex direction="column" align="center" justify="flex-start">
      <Title order={2} align="center" mb="md">
        Choose the plan that works best for you
      </Title>

      <Flex direction="column" align="center" justify="center" style={{ flexGrow: 1 }}>
        <Plans email={userProfile.email} projectId={userProfile._projectId} activePlanCode={activePlanCode as string} />
      </Flex>
    </Flex>
  );
};
