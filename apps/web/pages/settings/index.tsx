import getConfig from 'next/config';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Title } from '@mantine/core';
import { AppLayout } from '@layouts/AppLayout';
import { SettingsTab } from '@components/settings/SettingsTab';

export default function Settings() {
  const { publicRuntimeConfig } = getConfig();

  const stripePromise = loadStripe(publicRuntimeConfig.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

  return (
    <>
      <>
        <Title order={2}>Settings</Title>

        <Elements stripe={stripePromise}>
          <SettingsTab />
        </Elements>
      </>
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: 'Settings',
    },
  };
}

Settings.Layout = AppLayout;
