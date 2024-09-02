import Image from 'next/image';
import Link from 'next/link';
import { Title, Stack, Flex, Text } from '@mantine/core';

import { Button } from '@ui/button';
import { PasswordInput } from '@ui/password-input';
import DarkLogo from '@assets/images/logo-dark.png';
import { OnboardLayout } from '@layouts/OnboardLayout';
import { useResetPassword } from '@hooks/auth/useResetPassword';
import { PLACEHOLDERS, ROUTES, colors } from '@config';

export default function ResetPasswordPage({}) {
  const { register, resetPassword, error, isError } = useResetPassword();

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
          Reset your password
        </Title>
      </Flex>
      <form style={{ width: '100%' }} onSubmit={resetPassword}>
        <Stack w="100%">
          <PasswordInput
            required
            size="md"
            label="New Password"
            register={register('password')}
            placeholder={PLACEHOLDERS.password}
          />
          <Button fullWidth type="submit" size="md">
            Update password
          </Button>
          <Text align="center">
            Back to <Link href={ROUTES.SIGNIN}>Signin</Link>
          </Text>
        </Stack>
        {isError && (
          <Text mt={20} size="md" align="center" color={colors.danger}>
            {error?.message}
          </Text>
        )}
      </form>
    </>
  );
}

ResetPasswordPage.Layout = OnboardLayout;
