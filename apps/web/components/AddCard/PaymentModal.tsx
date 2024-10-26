import getConfig from 'next/config';
import React, { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import { MODAL_KEYS } from '@config';

import { modals } from '@mantine/modals';
import { ChangeCard } from './ChangeCard';
import { SubscribeToPlan } from './SubscribeToPlan';

const { publicRuntimeConfig } = getConfig();

const stripePromise =
  publicRuntimeConfig.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
  loadStripe(publicRuntimeConfig.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export interface PaymentModalProps {
  email: string;
  planCode: string;
  onClose: () => void;
  modalId: string;
}

export function PaymentModal(props: PaymentModalProps) {
  useEffect(() => {
    const modalId = props.modalId;
    modals.open({
      modalId,
      size: '50vw',
      withCloseButton: false,
      centered: true,

      children:
        modalId === MODAL_KEYS.SELECT_CARD ? (
          <Elements stripe={stripePromise}>
            <SubscribeToPlan {...props} />
          </Elements>
        ) : (
          <Elements stripe={stripePromise}>
            <ChangeCard {...props} />
          </Elements>
        ),
    });
  }, [props.modalId, props]);

  return null;
}
