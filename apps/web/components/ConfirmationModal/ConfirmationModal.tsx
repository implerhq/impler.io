import React from 'react';
import Lottie from 'lottie-react';
import { modals } from '@mantine/modals';
import { CONSTANTS } from '@config';
import { Stack, Text } from '@mantine/core';

import FailedAnimationData from './failed-animation-data.json';
import SuccessAnimationData from './success-animation-data.json';
import { Button } from '@ui/button';

interface ConfirmationModalProps {
  status: string;
}

export const ConfirmationModal = ({ status }: ConfirmationModalProps) => {
  return (
    <Stack spacing="md">
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
