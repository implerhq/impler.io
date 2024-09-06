import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import { UserCards } from './UserCards';
import { GenerateAccessToken } from './GenerateAccessToken';
import { OutlinedTabs } from '@ui/OutlinedTabs';

export function SettingsTab() {
  const router = useRouter();
  const { publicRuntimeConfig } = getConfig();

  const stripePromise =
    publicRuntimeConfig.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
    loadStripe(publicRuntimeConfig.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

  const tabItems = [
    {
      value: 'accesstoken',
      title: 'Access Token',
      content: <GenerateAccessToken />,
    },
    ...(stripePromise
      ? [
          {
            value: 'addcard',
            title: 'Cards',
            content: (
              <Elements stripe={stripePromise}>
                <UserCards />
              </Elements>
            ),
          },
        ]
      : []),
  ];

  return <OutlinedTabs defaultValue={(router.query.tab as string) || 'accesstoken'} items={tabItems} />;
}
