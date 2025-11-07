import React from 'react';
import dynamic from 'next/dynamic';
import { modals } from '@mantine/modals';
import { colors, CONSTANTS } from '@config';
import { Stack, Text } from '@mantine/core';

import { Button } from '@ui/button';
import FailedAnimationData from './failed-animation-data.json';
import SuccessAnimationData from './success-animation-data.json';
import { useRouter } from 'next/navigation';

interface PaymentConfirmationModalProps {
  paymentStatus: 'success' | 'failed';
}

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export function PaymentStatusConfirmationModal({ paymentStatus }: PaymentConfirmationModalProps) {
  const isSuccess = paymentStatus === CONSTANTS.PAYMENT_SUCCCESS_CODE;
  const title = isSuccess ? CONSTANTS.SUBSCRIPTION_ACTIVATED_TITLE : CONSTANTS.SUBSCRIPTION_FAILED_TITLE;
  const router = useRouter();

  return (
    <Stack spacing="xs">
      <Text color={colors.white} size="md" weight={700} align="center">
        {title}
      </Text>
      <Lottie animationData={isSuccess ? SuccessAnimationData : FailedAnimationData} loop={true} />
      <Text align="center">{isSuccess ? CONSTANTS.PAYMENT_SUCCESS_MESSAGE : CONSTANTS.PAYMENT_FAILED_MESSAGE}</Text>
      <Button
        fullWidth
        onClick={() => {
          modals.closeAll();
          router.push('/');
        }}
      >
        Go to Home
      </Button>
    </Stack>
  );
}
