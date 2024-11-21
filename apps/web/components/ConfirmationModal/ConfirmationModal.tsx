import React from 'react';
import Lottie from 'lottie-react';
import { modals } from '@mantine/modals';
import { colors, CONSTANTS } from '@config';
import { Stack, Text } from '@mantine/core';

import FailedAnimationData from './failed-animation-data.json';
import SuccessAnimationData from './success-animation-data.json';
import { Button } from '@ui/button';

interface ConfirmationModalProps {
  status: string;
}

export const ConfirmationModal = ({ status }: ConfirmationModalProps) => {
  const title =
    status === CONSTANTS.PAYMENT_SUCCCESS_CODE
      ? CONSTANTS.SUBSCRIPTION_ACTIVATED_TITLE
      : CONSTANTS.SUBSCRIPTION_FAILED_TITLE;

  return (
    <Stack spacing="xs">
      <Text color={colors.white} size="md" weight={700} align="center">
        {title}
      </Text>
      <Lottie
        animationData={status === CONSTANTS.PAYMENT_SUCCCESS_CODE ? SuccessAnimationData : FailedAnimationData}
        loop={true}
      />
      <Text align="center">
        {status === CONSTANTS.PAYMENT_SUCCCESS_CODE
          ? CONSTANTS.PAYMENT_SUCCESS_MESSAGE
          : CONSTANTS.PAYMENT_FAILED_MESSAGE}
      </Text>
      <Button fullWidth onClick={() => modals.closeAll()}>
        Go to Home
      </Button>
    </Stack>
  );
};
