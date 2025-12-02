import { Container, Flex } from '@mantine/core';
import { Stepper } from '@components/Stepper/Stepper';
import { Button } from '@ui/button';
import Link from 'next/link';
import { PLACEHOLDERS, ROUTES } from '@config';
import { PasswordInput } from '@ui/password-input';
import { useSignup } from '@hooks/auth/useSignup';
import { formatUrl } from '@shared/helpers';
import { Title, Stack, Text, FocusTrap, TextInput } from '@mantine/core';
import { OnboardLayout } from '@layouts/OnboardLayout';

export default function SignupPage() {
  const { register, isSignupLoading, signup, errors, isInvitationLink, invitationId } = useSignup();

  return (
    <OnboardLayout>
      <Container size="xs">
        <Flex justify="space-between" align="center">
          <Title order={1} color="white" mb={0}>
            Get Started
          </Title>

          <Stepper currentStep={1} totalSteps={2} />
        </Flex>

        <Text mt="md" size="xs" color="dimmed">
          Get your free trial — explore every feature for 14 days, then keep building on our free plan.
        </Text>
        <Text mt="xs" mb="xs" size="xs" color="dimmed">
          No credit card required • 2,500 free records/month • Cancel anytime
        </Text>

        {/* <Stepper currentStep={1} totalSteps={2} /> */}
        <FocusTrap>
          <form onSubmit={signup} style={{ width: '100%' }}>
            <Stack>
              <TextInput
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
              <TextInput
                size="md"
                required
                type="email"
                label="Email"
                {...register('email')}
                error={errors.email?.message}
                placeholder={PLACEHOLDERS.email}
                description="You will receive verification code to be entered in next screen!"
                disabled={isInvitationLink}
              />
              <PasswordInput
                required
                size="md"
                label="Password"
                register={register('password')}
                placeholder={PLACEHOLDERS.password}
              />
              <Button loading={isSignupLoading} fullWidth type="submit" size="md">
                Create an account
              </Button>
              <Text size="md" ta="center">
                Already have an account? <Link href={formatUrl(ROUTES.SIGNIN, [], { invitationId })}>Sign In</Link>
              </Text>
            </Stack>
          </form>
        </FocusTrap>
      </Container>
    </OnboardLayout>
  );
}
