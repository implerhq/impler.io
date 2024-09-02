import Link from 'next/link';
import Image from 'next/image';
import { Title, Stack, Flex, Text, TextInput as Input } from '@mantine/core';

import { Button } from '@ui/button';
import { colors, PLACEHOLDERS, ROUTES } from '@config';
import DarkLogo from '@assets/images/logo-dark.png';
import { OnboardLayout } from '@layouts/OnboardLayout';
import { useRequestForgotPassword } from '@hooks/auth/useRequestForgotPassword';

export default function RequestForgotPasswordPage() {
  const { register, requestSent, isForgotPasswordRequesting, request } = useRequestForgotPassword();

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
            We have sent you an email with a link to reset your password. Please check your inbox!
          </Text>
          <Text align="center">
            Back to <Link href={ROUTES.SIGNIN}>Signin</Link>
          </Text>
        </Stack>
      ) : (
        <form style={{ width: '100%' }} onSubmit={request}>
          <Stack w="100%">
            <Input
              required
              size="md"
              type="email"
              label="Email"
              {...register('email')}
              placeholder={PLACEHOLDERS.email}
              description="Password reset link will be sent to the email!"
            />
            <Button fullWidth type="submit" size="md" disabled={requestSent} loading={isForgotPasswordRequesting}>
              Send password reset link
            </Button>
            <Text align="center">
              Back to <Link href={ROUTES.SIGNIN}>Signin</Link>
            </Text>
          </Stack>
        </form>
      )}
    </>
  );
}

RequestForgotPasswordPage.Layout = OnboardLayout;
