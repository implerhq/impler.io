import { AppLayout } from '@layouts/AppLayout';
import { modals } from '@mantine/modals';
import { CONSTANTS } from '@config';
import { Stack } from '@mantine/core';
import { useEffect } from 'react';
import { PaymentSuccessConfirmationModal } from '@components/ConfirmationModal';

export default function PaymentCancel() {
  useEffect(() => {
    modals.open({
      title: 'Subscription Status',
      children: (
        <Stack spacing="lg">
          <PaymentSuccessConfirmationModal paymentStatus={CONSTANTS.PAYMENT_FAILED_CODE as 'failed'} />
        </Stack>
      ),
    });
  }, []);

  return null;
}

export async function getServerSideProps() {
  return {
    props: {
      title: 'Payment Cancel',
    },
  };
}

PaymentCancel.Layout = AppLayout;
