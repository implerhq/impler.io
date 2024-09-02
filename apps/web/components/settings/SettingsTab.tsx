import getConfig from 'next/config';
import { Tabs } from '@mantine/core';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import { UserCards } from './UserCards';
import { GenerateAccessToken } from './GenerateAccessToken';

export function SettingsTab() {
  const router = useRouter();
  const { publicRuntimeConfig } = getConfig();

  const stripePromise =
    publicRuntimeConfig.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
    loadStripe(publicRuntimeConfig.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

  return (
    <Tabs mt={2} defaultValue={(router.query.tab as string) || 'accesstoken'}>
      <Tabs.List>
        <Tabs.Tab value="accesstoken">Access Token</Tabs.Tab>
        {stripePromise ? <Tabs.Tab value="addcard">Cards</Tabs.Tab> : null}
      </Tabs.List>

      <Tabs.Panel value="accesstoken" pt="xs">
        <GenerateAccessToken />
      </Tabs.Panel>

      {stripePromise ? (
        <Tabs.Panel value="addcard" pt="xs">
          <Elements stripe={stripePromise}>
            <UserCards />
          </Elements>
        </Tabs.Panel>
      ) : null}
    </Tabs>
  );
}
