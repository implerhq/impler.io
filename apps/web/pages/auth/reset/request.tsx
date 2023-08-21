import Image from 'next/image';
import { Title, Stack, Flex, Text } from '@mantine/core';

import { colors } from '@config';
import { Input } from '@ui/input';
import { Button } from '@ui/button';
import DarkLogo from '@assets/images/logo-dark.png';
import { OnboardLayout } from '@layouts/OnboardLayout';
import { useRequestForgotPassword } from '@hooks/auth/useRequestForgotPassword';

export default function RequestForgotPasswordPage() {
  const { register, requestSent, isForgotPasswordRequesting, request, goToLogin } = useRequestForgotPassword();

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
        <Image src={DarkLogo} width={80} alt="Impler Logo" />
        <Title order={1} color="white">
          Request a password reset
        </Title>
      </Flex>
      {requestSent ? (
        <Stack>
          <Text color={colors.TXTSecondaryDark}>
            We have sent you an email with a link to reset your password. Please check your inbox.
          </Text>
          <Button fullWidth size="sm" onClick={goToLogin}>
            Back to login
          </Button>
        </Stack>
      ) : (
        <form style={{ width: '100%' }} onSubmit={request}>
          <Stack w="100%">
            <Input register={register('email')} size="md" placeholder="Email" type="email" required />
            <Button fullWidth type="submit" size="md" disabled={requestSent} loading={isForgotPasswordRequesting}>
              Send password reset link
            </Button>
          </Stack>
        </form>
      )}
    </>
  );
}

RequestForgotPasswordPage.Layout = OnboardLayout;
