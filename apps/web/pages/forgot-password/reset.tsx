import Image from 'next/image';
import { Title, Stack, Flex } from '@mantine/core';

import { Button } from '@ui/button';
import { PasswordInput } from '@ui/password-input';
import DarkLogo from '@assets/images/logo-dark.png';
import { OnboardLayout } from '@layouts/OnboardLayout';

export default function ResetPasswordPage({}) {
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
          Reset your password
        </Title>
      </Flex>
      <Stack w="100%">
        <PasswordInput size="md" placeholder="New Password" />
        <Button fullWidth type="submit" size="md">
          Save new password
        </Button>
      </Stack>
    </>
  );
}

ResetPasswordPage.Layout = OnboardLayout;
