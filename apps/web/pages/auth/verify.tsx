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
} from '@mantine/core';

import { colors } from '@config';
import { RedoIcon } from '@assets/icons/Redo.icon';
import { useVerify } from '@hooks/auth/useVerify';
import { OnboardLayout } from '@layouts/OnboardLayout';
import { IconButton } from '@ui/icon-button';
import { EditIcon } from '@assets/icons/Edit.icon';

export default function OtpVerifyPage() {
  const { resendOTP, isButtonDisabled, countdown, verify, isVerificationLoading, profile } = useVerify();
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
            <Text component="span" fw="bold" color={colors.blue}>
              {profile?.email}
            </Text>
            <IconButton mx="sm" label="Update Email">
              <EditIcon color={colors.blue} />
            </IconButton>
          </Text>

          <Divider size="xs" />

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
        </Stack>
      </Container>
    </>
  );
}

OtpVerifyPage.Layout = OnboardLayout;
