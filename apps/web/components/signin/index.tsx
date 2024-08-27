import Link from 'next/link';
import Image from 'next/image';
import { Title, Text, Stack, Divider, Flex, Box, Alert, TextInput as Input } from '@mantine/core';

import { Button } from '@ui/button';
import { useSignin } from '@hooks/auth/useSignin';
import { PasswordInput } from '@ui/password-input';
import { CONSTANTS, ROUTES, colors } from '@config';

import DarkLogo from '@assets/images/logo-dark.png';
import { GithubIcon } from '@assets/icons/Github.icon';

interface SigninProps {
  API_URL: string;
  error?: string;
}

export const Signin = ({ API_URL, error }: SigninProps) => {
  const { register, isLoginLoading, login, errorMessage } = useSignin();

  return (
    <>
      <Flex
        gap="sm"
        direction="column"
        mb="md"
        align={{
          base: 'center',
          md: 'flex-start',
        }}
      >
        <Image src={DarkLogo} width={80} alt="Impler Logo" />
        <Title order={1} color="white">
          Signin to your account
        </Title>
      </Flex>
      <Box w="100%">
        <Button fullWidth component="a" size="md" href={API_URL + CONSTANTS.GITHUB_LOGIN_URL} leftIcon={<GithubIcon />}>
          Continue with Github
        </Button>
        {error && error === CONSTANTS.AUTHENTICATION_ERROR_CODE && (
          <Text color="red" pt="sm" fw={600}>
            Some error occured while signin, please try again later.
          </Text>
        )}
      </Box>
      <Divider
        size="sm"
        my="md"
        label="or Sign In with Email"
        labelPosition="center"
        color={colors.StrokeSecondaryDark}
        w="100%"
      />
      <form style={{ width: '100%' }} onSubmit={login}>
        <Stack>
          {errorMessage && errorMessage.message ? (
            <Alert color={colors.white} mb="sm" bg={colors.danger} p="xs">
              {errorMessage.message}
            </Alert>
          ) : null}
          <Input label="Email" {...register('email')} size="md" placeholder="Email" type="email" required />
          <PasswordInput label="Password" register={register('password')} size="md" placeholder="Password" required />
          <Link href={ROUTES.REQUEST_FORGOT_PASSWORD}>
            <Text size="md" align="right">
              Forgot password?
            </Text>
          </Link>
          <Button loading={isLoginLoading} fullWidth type="submit" size="md">
            Sign In
          </Button>
          <Text size="md" align="center">
            Don&apos;t have an account? <Link href={ROUTES.SIGNUP}>Sign Up</Link>
          </Text>
        </Stack>
      </form>
    </>
  );
};
