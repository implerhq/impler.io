import { Flex, Title, Text } from '@mantine/core';
import { Plans } from './Plans';

interface PlanPricingTableProps {
  userProfile: IProfileData;
}

export function PlanPricingTable({ userProfile }: PlanPricingTableProps) {
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
        <Plans />
      </Flex>
    </Flex>
  );
}
