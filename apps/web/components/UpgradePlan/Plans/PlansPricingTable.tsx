import { Flex } from '@mantine/core';
import { PlansModal } from './PlansModal';

interface PlanPricingTableProps {
  userProfile: IProfileData;
  activePlanCode: string;
}

export function PlanPricingTable({ userProfile, activePlanCode }: PlanPricingTableProps) {
  return (
    <Flex key={userProfile?.email}>
      <PlansModal userProfile={userProfile} activePlanCode={activePlanCode} />
    </Flex>
  );
}
