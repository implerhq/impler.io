import React from 'react';
import Lottie from 'lottie-react';
import { modals } from '@mantine/modals';
import { CONSTANTS, colors } from '@config';
import { Button, Stack, Text } from '@mantine/core';

import FailedAnimationData from './failed-animation-data.json';
import SuccessAnimationData from './success-animation-data.json';

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
      <Button fullWidth color={colors.danger} onClick={() => modals.closeAll()}>
        Ok
      </Button>
    </Stack>
  );
};
