import { useRef } from 'react';
import { Text, Title, Group, Stack, Divider, Center, Container } from '@mantine/core';
import Link from 'next/link';
import { colors, ROUTES } from '@config';
import { Button } from '@ui/button';

export function InactiveMembership() {
  const pricingRef = useRef<HTMLDivElement>(null);

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Stack spacing="md">
      <Group position="apart">
        <Title order={4}>Plan Expiry</Title>
        <Button component={Link} href={ROUTES.TRANSACTIONS} variant="filled" radius="md">
          View all Transactions
        </Button>
      </Group>
      <Divider />

      <Center>
        <Stack w={500} align="center">
          <Text fw="bolder" color={colors.danger} align="center">
            You don&apos;t have any active membership. Consider choosing an{' '}
            <Text
              component="span"
              color={colors.yellow}
              sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={scrollToPricing}
            >
              appropriate plan
            </Text>
            . You can see all transactions{' '}
            <Text component={Link} href={ROUTES.TRANSACTIONS} color={colors.yellow} td="underline">
              here.
            </Text>
          </Text>
        </Stack>
      </Center>

      <Container ref={pricingRef} />
    </Stack>
  );
}
