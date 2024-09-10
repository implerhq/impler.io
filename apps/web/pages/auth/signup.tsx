import Link from 'next/link';
import Image from 'next/image';
import { Title, Text, Stack, Flex, TextInput as Input, FocusTrap } from '@mantine/core';
import { Button } from '@ui/button';
import { PasswordInput } from '@ui/password-input';
import { PLACEHOLDERS, ROUTES } from '@config';
import { useSignup } from '@hooks/auth/useSignup';
import DarkLogo from '@assets/images/logo-dark.png';
import { OnboardLayout } from '@layouts/OnboardLayout';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAcceptProjectInvitation } from '@hooks/useAcceptProjectInvitation';

export default function SignupPage() {
  const router = useRouter();
  const { register, isSignupLoading, signup, errors } = useSignup();

  const { invitationId, token } = router.query;

  const { invitationEmail } = useAcceptProjectInvitation({
    invitationId: invitationId as string,
    token: token as string,
  });

  useEffect(() => {
    if (router.isReady && invitationId && token) {
      console.log(invitationId, token);
      console.log(invitationEmail);
    }
  }, [router.isReady, invitationId, token]);

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
          Create your account
        </Title>
      </Flex>
      <FocusTrap>
        <form onSubmit={signup} style={{ width: '100%' }}>
          <Stack>
            <Input
              required
              size="md"
              label="Full Name"
              placeholder={PLACEHOLDERS.fullName}
              error={errors.fullName?.message}
              {...register('fullName', {
                pattern: {
                  value: /\w+\s\w+/gm,
                  message: 'Please enter your full name. E.g. John Doe',
                },
              })}
            />
            <Input
              size="md"
              required
              label="Email"
              {...register('email')}
              error={errors.email?.message}
              placeholder={PLACEHOLDERS.email}
              description="Verification code will be sent to your email!"
            />
            <PasswordInput
              required
              size="md"
              label="Password"
              register={register('password')}
              placeholder={PLACEHOLDERS.password}
            />
            <Button id="signup" loading={isSignupLoading} fullWidth type="submit" size="md">
              Create an account
            </Button>
            <Text size="md" align="center">
              Already have an account? <Link href={ROUTES.SIGNIN}>Sign In</Link>
            </Text>
          </Stack>
        </form>
      </FocusTrap>
    </>
  );
}

SignupPage.Layout = OnboardLayout;
