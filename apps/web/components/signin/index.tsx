import Link from 'next/link';
import { Title, Text, Stack, Divider, Box, Alert, TextInput as Input } from '@mantine/core';

import { Button } from '@ui/button';
import { useSignin } from '@hooks/auth/useSignin';
import { PasswordInput } from '@ui/password-input';
import { CONSTANTS, PLACEHOLDERS, ROUTES, colors } from '@config';
import { GithubIcon } from '@assets/icons/Github.icon';

interface SigninProps {
  API_URL: string;
  error?: string;
}

export const Signin = ({ API_URL, error }: SigninProps) => {
  const { register, isLoginLoading, login, errorMessage } = useSignin();

  return (
    <Box>
      <Title order={1} color="white" mb="md">
        Let&apos;s Continue
      </Title>
      <Text size="xs" mb="md" color="dimmed">
        Get your free trial — explore every feature for 14 days, then keep building on our free plan.
      </Text>
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
        <Stack spacing="md">
          {errorMessage && errorMessage.message ? (
            <Alert color={colors.white} mb="sm" bg={colors.danger} p="xs">
              {errorMessage.message}
            </Alert>
          ) : null}
          <Input
            required
            size="md"
            type="email"
            label="Email"
            {...register('email')}
            placeholder={PLACEHOLDERS.email}
          />
          <PasswordInput
            required
            size="md"
            label="Password"
            register={register('password')}
            placeholder={PLACEHOLDERS.password}
          />
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
    </Box>
  );
};
