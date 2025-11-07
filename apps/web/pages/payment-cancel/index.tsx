import { AppLayout } from '@layouts/AppLayout';
import { modals } from '@mantine/modals';
import { CONSTANTS } from '@config';
import { Stack } from '@mantine/core';
import { useEffect } from 'react';
import { PaymentStatusConfirmationModal } from '@components/ConfirmationModal';

export default function PaymentCancel() {
  useEffect(() => {
    modals.open({
      title: 'Subscription Status',
      children: (
        <Stack spacing="lg">
          <PaymentStatusConfirmationModal paymentStatus={CONSTANTS.PAYMENT_FAILED_CODE as 'failed'} />
        </Stack>
      ),
      onClose: () => {
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      },
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
