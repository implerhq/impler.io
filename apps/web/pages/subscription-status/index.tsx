import { Stack } from '@mantine/core';
import { AppLayout } from '@layouts/AppLayout';
import { useEffect } from 'react';
import { PaymentStatusConfirmationModal } from '@components/ConfirmationModal';
import { CONSTANTS } from '@config';
import { modals } from '@mantine/modals';

export interface PaymentParams {
  gateway?: string;
  sessionId?: string;
  paymentId?: string;
  reason?: string;
}

export default function SubscriptionStatus() {
  useEffect(() => {
    modals.open({
      title: 'Subscription Status',
      children: (
        <Stack spacing="lg">
          <PaymentStatusConfirmationModal paymentStatus={CONSTANTS.PAYMENT_SUCCCESS_CODE as 'failed'} />
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
      title: 'Subscription Status',
    },
  };
}

SubscriptionStatus.Layout = AppLayout;
