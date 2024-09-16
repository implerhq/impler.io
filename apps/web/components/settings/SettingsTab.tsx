import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import { UserCards } from './UserCards';
import { GenerateAccessToken } from './GenerateAccessToken';
import { OutlinedTabs } from '@ui/OutlinedTabs';
import { useApp } from '@hooks/useApp';
import { defineAbilitiesFor } from 'config/defineAbilities';

export function SettingsTab() {
  const { profile } = useApp();
  const ability = defineAbilitiesFor(profile?.role);
  const router = useRouter();
  const { publicRuntimeConfig } = getConfig();

  const stripePromise =
    publicRuntimeConfig.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
    loadStripe(publicRuntimeConfig.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

  const tabItems = [
    ability.can('read', 'AccessToken') && {
      value: 'accesstoken',
      title: 'Access Token',
      content: <GenerateAccessToken />,
    },
    stripePromise &&
      ability.can('read', 'Cards') && {
        value: 'addcard',
        title: 'Cards',
        content: (
          <Elements stripe={stripePromise}>
            <UserCards />
          </Elements>
        ),
      },
  ].filter(Boolean);

  const validTabValues = tabItems.map((item) => item.value);
  const defaultTab = (router.query.tab as string) || 'accesstoken';
  const selectedTab = validTabValues.includes(defaultTab) ? defaultTab : validTabValues[0] || 'accesstoken';

  return <OutlinedTabs defaultValue={selectedTab} items={tabItems} />;
}
