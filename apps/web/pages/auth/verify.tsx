import React from 'react';
import {
  Container,
  Text,
  Group,
  Divider,
  PinInput,
  FocusTrap,
  UnstyledButton,
  Flex,
  Stack,
  LoadingOverlay,
  Title,
  TextInput as Input,
} from '@mantine/core';

import { colors } from '@config';
import { RedoIcon } from '@assets/icons/Redo.icon';
import { EditIcon } from '@assets/icons/Edit.icon';
import { useVerify } from '@hooks/auth/useVerify';
import { OnboardLayout } from '@layouts/OnboardLayout';
import { Button } from '@ui/button';

export default function OtpVerifyPage() {
  const {
    resendOTP,
    isButtonDisabled,
    countdown,
    verify,
    register,
    profile,
    state,
    errors,
    setState,
    updateEmail,
    ScreenStatesEnum,
    isUpdateEmailLoading,
    isVerificationLoading,
  } = useVerify();
  const commonStyles = {
    color: isButtonDisabled ? colors.white : colors.blue,
    cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
    opacity: isButtonDisabled ? 0.6 : 1,
  };

  return (
    <>
      <LoadingOverlay visible={!profile} />
      <Container size="md" p="md">
        <Title align="left" order={1} weight="bolder">
          We sent a verification code to your email
        </Title>
        <Stack mt="xs">
          <Text size="md" color="dimmed" align="left">
            To continue, please enter the 6-digit verification code sent to your email{' '}
            <UnstyledButton onClick={() => setState(ScreenStatesEnum.UPDATE_EMAIL)} disabled={isUpdateEmailLoading}>
              <Text mr={5} component="span" fw="bold" color={colors.blue}>
                {profile?.email}
              </Text>
              <EditIcon color={colors.blue} style={{ verticalAlign: 'middle' }} />
            </UnstyledButton>
          </Text>

          <Divider size="xs" />

          {state === ScreenStatesEnum.VERIFY ? (
            <>
              <FocusTrap>
                <Flex justify="center">
                  <PinInput
                    autoFocus
                    required
                    length={6}
                    size="lg"
                    disabled={isVerificationLoading}
                    onComplete={(otp) => verify({ otp })}
                  />
                </Flex>
              </FocusTrap>

              <Group position="apart">
                <UnstyledButton style={commonStyles} onClick={() => resendOTP()} disabled={isButtonDisabled}>
                  <Group spacing="xs">
                    <RedoIcon size="md" />
                    <Text>Request new code</Text>
                  </Group>
                </UnstyledButton>
                <Text color="dimmed">
                  {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
                </Text>
              </Group>
            </>
          ) : (
            <FocusTrap>
              <form onSubmit={updateEmail}>
                <Stack spacing="xs">
                  <Input
                    {...register('email')}
                    size="md"
                    placeholder="new@email.com"
                    type="email"
                    required
                    error={errors.email?.message}
                    disabled={isUpdateEmailLoading}
                  />
                  <Button type="submit" loading={isUpdateEmailLoading} fullWidth>
                    Update Email
                  </Button>
                </Stack>
              </form>
            </FocusTrap>
          )}
        </Stack>
      </Container>
    </>
  );
}

OtpVerifyPage.Layout = OnboardLayout;
