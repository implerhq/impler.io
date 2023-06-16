import Image from 'next/image';
import { Title, Stack, Flex, Text } from '@mantine/core';

import { colors } from '@config';
import { Input } from '@ui/input';
import { Button } from '@ui/button';
import DarkLogo from '@assets/images/logo-dark.png';
import { OnboardLayout } from '@layouts/OnboardLayout';

export default function RequestForgotPasswordPage({}) {
  return (
    <>
      <Flex
        gap="xs"
        direction="column"
        mb="md"
        align={{
          base: 'center',
          md: 'flex-start',
        }}
      >
        <Image src={DarkLogo} alt="Impler Logo" />
        <Title order={1} color="white">
          Request a password reset
        </Title>
        <Text color={colors.TXTSecondaryDark}>We&apos;ll send you a link to reset your password.</Text>
      </Flex>
      <Stack w="100%">
        <Input size="md" placeholder="Email" />
        <Button fullWidth type="submit" size="md">
          Send password reset link
        </Button>
      </Stack>
    </>
  );
}

RequestForgotPasswordPage.Layout = OnboardLayout;
