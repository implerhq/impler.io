import Link from 'next/link';
import Image from 'next/image';
import { Title, Text, Stack, Divider, Flex, Box } from '@mantine/core';

import { Input } from '@ui/input';
import { Button } from '@ui/button';
import { CONSTANTS, colors } from '@config';

import DarkLogo from '@assets/images/logo-dark.png';
import { GithubIcon } from '@assets/icons/Github.icon';

interface SigninProps {
  API_URL: string;
  error?: string;
}

export const Signin = ({ API_URL, error }: SigninProps) => {
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
        <Image src={DarkLogo} alt="Impler Logo" />
        <Title order={1} color="white">
          Login to your account
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
      <Stack w="100%">
        <Input size="md" placeholder="Email" />
        <Input size="md" placeholder="Password" />
        <Link href="/forgot-password">
          <Text size="md" align="right">
            Forgot password?
          </Text>
        </Link>
        <Button fullWidth type="submit" size="md">
          Sign In
        </Button>
        <Text size="md" align="center">
          Don&apos;t have an account? <Link href="/signup">Sign Up</Link>
        </Text>
      </Stack>
    </>
  );
};
