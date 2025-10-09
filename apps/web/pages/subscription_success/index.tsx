import { Stack, Title } from '@mantine/core';
import { AppLayout } from '@layouts/AppLayout';
import { PaymentSuccessView } from 'subos-frontend';
import { useMemo } from 'react';

export interface PaymentParams {
  gateway?: string;
  sessionId?: string;
  paymentId?: string;
  reason?: string;
}

export default function SubscriptionSuccess() {
  const usePaymentParams = (): PaymentParams => {
    return useMemo(() => {
      const params = new URLSearchParams(window.location.search);

      return {
        gateway: params.get('gateway') || undefined,
        sessionId: params.get('session_id') || undefined,
        paymentId: params.get('payment_id') || undefined,
        reason: params.get('reason') || undefined,
      };
    }, []);
  };

  const paymentParams = usePaymentParams();

  return (
    <>
      <Title order={2} mb="sm">
        Subscription Success
      </Title>
      <Stack spacing="lg">
        <PaymentSuccessView details={paymentParams} />
      </Stack>
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: 'Subscription Success',
    },
  };
}

SubscriptionSuccess.Layout = AppLayout;
