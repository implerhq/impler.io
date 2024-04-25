import { colors } from '@config';
import { Title, Text, Stack, Flex, Button } from '@mantine/core';

export function PlanDetails() {
  return (
    <Flex
      p="sm"
      gap="sm"
      direction="row"
      align="center"
      style={{ border: `1px solid ${colors.yellow}`, backgroundColor: colors.yellow + '20' }}
    >
      <Stack spacing="xs" style={{ flexGrow: 1 }}>
        <Title order={4}>Usage</Title>
        <Text>
          You have imported {10} of {1000} records this month on the {'Sandbox'} plan (resets on {'24-05-2024'})
        </Text>
      </Stack>
      <Button color="yellow">Upgrade Plan</Button>
    </Flex>
  );
}
