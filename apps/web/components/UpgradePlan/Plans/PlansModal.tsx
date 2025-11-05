import React from 'react';
import { Flex, Title, Text } from '@mantine/core';
import { Plans } from '.';

interface PlanProps {
  userProfile?: IProfileData;
  activePlanCode?: string;
  canceledOn?: string;
  expiryDate?: string;
}

export const PlansModal = ({ userProfile, activePlanCode }: PlanProps) => {
  if (!userProfile) {
    return (
      <Flex direction="column" align="center" justify="center" style={{ flexGrow: 1 }}>
        <Text>Loading profile information...</Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" align="center" justify="flex-start">
      <Title order={2} align="center" mb="md">
        Choose the plan that works best for you
      </Title>

      <Flex direction="column" align="center" justify="center" style={{ flexGrow: 1 }}>
        <Plans email={userProfile.email} projectId={userProfile._projectId} activePlanCode={activePlanCode!} />
      </Flex>
    </Flex>
  );
};
