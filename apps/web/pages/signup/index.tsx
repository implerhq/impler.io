import Link from 'next/link';
import Image from 'next/image';
import { Title, Text, Stack, Flex } from '@mantine/core';

import { Input } from '@ui/input';
import { Button } from '@ui/button';
import DarkLogo from '@assets/images/logo-dark.png';
import { OnboardLayout } from '@layouts/OnboardLayout';

export default function SignupPage({}) {
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
          Register yourself
        </Title>
      </Flex>
      <Stack w="100%">
        <Input size="md" placeholder="Full Name" />
        <Input size="md" placeholder="Email" />
        <Input size="md" placeholder="Password" />
        <Button fullWidth type="submit" size="md">
          Create an account
        </Button>
        <Text size="md" align="center">
          Already have an account? <Link href="/signin">Sign In</Link>
        </Text>
      </Stack>
    </>
  );
}

SignupPage.Layout = OnboardLayout;
