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
  const {
    control,
    handleVerify,
    resendOTP,
    error,
    formError,
    setFormError,
    isVerificationLoading,
    isButtonDisabled,
    countdown,
  } = useVerify();
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
        {`To continue, please enter the 6-digit verification code sent to your email `}
        <Text component="span" color={colors.blue}>
          {profile?.email}
        </Text>
      </Text>

      <Divider my="lg" />

      <form onSubmit={handleVerify}>
        <FocusTrap>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Controller
              name="otp"
              control={control}
              rules={{ required: 'Code is required' }}
              render={({ field: { onChange, value }, fieldState: { error: fieldError } }) => (
                <>
                  <PinInput
                    autoFocus
                    required
                    length={6}
                    value={value}
                    onChange={(val) => {
                      onChange(val);
                      if (formError) setFormError('');
                    }}
                    onComplete={(otp) => onChange(otp)}
                  />
                  {fieldError && (
                    <Text color="red" size="sm" mt="sm" align="center">
                      {fieldError.message}
                    </Text>
                  )}
                </>
              )}
            />
          </Box>
          {formError && (
            <Text color="red" size="sm" mt="sm" align="center">
              {formError}
            </Text>
          )}
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
        <UnstyledButton style={commonStyles} onClick={() => resendOTP()} disabled={isButtonDisabled}>
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
