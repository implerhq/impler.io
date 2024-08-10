import React from 'react';
import { Controller } from 'react-hook-form';
import { Container, Text, Group, Divider, Box, PinInput, FocusTrap, UnstyledButton, Flex } from '@mantine/core';
import { OnboardLayout } from '@layouts/OnboardLayout';
import { Button } from '@ui/button';
import { RedoIcon } from '@assets/icons/Redo.icon';
import { useVerify } from '@hooks/auth/useVerify';
import { colors } from '@config';
import { useApp } from '@hooks/useApp';

export default function OtpVerifyPage() {
  const { profile } = useApp();
  const { control, handleVerify, handleResendCode, error, isVerificationLoading, isButtonDisabled, countdown } =
    useVerify();

  const commonStyles = {
    color: isButtonDisabled ? colors.white : colors.blue,
    cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
    opacity: isButtonDisabled ? 0.6 : 1,
  };

  return (
    <Container size="md" p="md">
      <Text align="left" size="xl" weight="bolder">
        Verification Contact Information
      </Text>
      <Text size="md" color="dimmed" align="left" mt="lg">
        We just need to confirm a couple of details, it&lsquo;s only take a minute.
      </Text>

      <Divider my="lg" />
      <Text size="xs" align="center" mb="xs" color="dimmed">
        Enter the 6 digit verification code we just sent to {profile?.email}.
      </Text>

      <form onSubmit={handleVerify}>
        <FocusTrap>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Controller
              name="otp"
              control={control}
              rules={{ required: 'OTP is required' }}
              render={({ field: { onChange, value } }) => (
                <PinInput length={6} value={value} onChange={onChange} onComplete={(otp) => onChange(otp)} />
              )}
            />
          </Box>
          {error && (
            <Text color="red" size="sm" mt="sm" align="center">
              {error.message}
            </Text>
          )}
        </FocusTrap>

        <Group position="center" mt="md">
          <Button fullWidth type="submit" loading={isVerificationLoading}>
            Verify
          </Button>
        </Group>
      </form>

      <Flex justify="space-between" align="center" mt="sm">
        <UnstyledButton style={commonStyles} onClick={handleResendCode} disabled={isButtonDisabled}>
          <Flex align="center">
            <RedoIcon size="md" />
            <Text ml="xs">Resend code</Text>
          </Flex>
        </UnstyledButton>
        <Text color="dimmed">
          {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
        </Text>
      </Flex>
    </Container>
  );
}

OtpVerifyPage.Layout = OnboardLayout;
