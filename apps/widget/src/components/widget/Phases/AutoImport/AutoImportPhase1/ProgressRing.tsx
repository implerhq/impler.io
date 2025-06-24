import { Stack, RingProgress, Text } from '@mantine/core';

export function ProgressRing({ percentage }: { percentage: number }) {
  return (
    <Stack align="center" spacing="md">
      <RingProgress
        size={160}
        thickness={12}
        sections={[
          {
            value: percentage,
            color: 'primary',
          },
        ]}
        label={
          <Text color="primary" weight={700} align="center" size="xl">
            {percentage}%
          </Text>
        }
      />
    </Stack>
  );
}
