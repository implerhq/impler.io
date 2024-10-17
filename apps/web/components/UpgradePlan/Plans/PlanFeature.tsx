import { Flex, Text } from '@mantine/core';
import { CheckCircle } from '@assets/icons/CheckCircle.icon';
import { CrossCircle } from '@assets/icons/CrossCircle.icon';

interface PlanFeatureProps {
  included: boolean;
  value?: string; // This will be the title
}

export function PlanFeature({ included, value }: PlanFeatureProps) {
  return (
    <>
      <Flex align="center" gap="sm">
        {included ? <CheckCircle /> : <CrossCircle />}
        <Text>{value}</Text>
      </Flex>
    </>
  );
}
