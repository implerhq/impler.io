import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import getConfig from 'next/config';
import { MODAL_KEYS } from '@config';
import { ChangeCard } from './ChangeCard';
import { SubscribeToPlan } from './SubscribeToPlan';

const { publicRuntimeConfig } = getConfig();

const stripePromise =
  publicRuntimeConfig.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
  loadStripe(publicRuntimeConfig.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export interface PaymentModalProps {
  email: string;
  planCode: string;
  projectId: string;
  onClose: () => void;
  modalId: string;
}

export function PaymentModal(props: PaymentModalProps) {
  return (
    <Elements stripe={stripePromise}>
      {props.modalId === MODAL_KEYS.SELECT_CARD ? <SubscribeToPlan {...props} /> : <ChangeCard {...props} />}
    </Elements>
  );
}
