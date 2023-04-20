import Image from 'next/image';
import { Title, Text } from '@mantine/core';

import { CONSTANTS } from '@config';
import { Button } from '@ui/button';

import DarkLogo from '@assets/images/logo-dark.png';
import { GithubIcon } from '@assets/icons/Github.icon';

interface SigninProps {
  API_URL: string;
  error?: string;
}

export const Signin = ({ API_URL, error }: SigninProps) => {
  return (
    <>
      <Image src={DarkLogo} alt="Impler Logo" />
      <Title order={1} color="white" mt="sm">
        Signin to Impler
      </Title>
      <Text color="white" mb="sm">
        Hop into your account to start importing records
      </Text>
      <Button component="a" href={API_URL + CONSTANTS.GITHUB_LOGIN_URL} leftIcon={<GithubIcon />}>
        Continue with Github
      </Button>
      {error && error === CONSTANTS.AUTHENTICATION_ERROR_CODE && (
        <Text color="red" pt="sm" fw={600}>
          Some error occured while signin, please try again later.
        </Text>
      )}
    </>
  );
};
