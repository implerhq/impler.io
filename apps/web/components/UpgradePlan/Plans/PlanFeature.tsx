import { Flex, Text } from '@mantine/core';
import { CheckCircle } from '@assets/icons/CheckCircle.icon';
import { CrossCircle } from '@assets/icons/CrossCircle.icon';

interface PlanFeatureProps {
  included: boolean;
  value?: string;
}

export function PlanFeature({ included, value }: PlanFeatureProps) {
  return (
    <>
      <Flex align="center" gap="sm">
        {included ? <CheckCircle /> : <CrossCircle />}
        <Text fw="bolder">{value}</Text>
      </Flex>
    </>
  );
}
