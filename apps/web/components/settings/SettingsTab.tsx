import { useContext } from 'react';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import { UserCards } from './UserCards';
import { OutlinedTabs } from '@ui/OutlinedTabs';
import { AbilityContext } from 'store/ability.context';
import { GenerateAccessToken } from './GenerateAccessToken';
import { ActionsEnum, AppAbility, SubjectsEnum } from '@config';

export function SettingsTab() {
  const router = useRouter();
  const { publicRuntimeConfig } = getConfig();
  const ability = useContext<AppAbility | null>(AbilityContext);

  const stripePromise =
    publicRuntimeConfig.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
    loadStripe(publicRuntimeConfig.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

  const tabItems = [
    ability &&
      ability.can(ActionsEnum.READ, SubjectsEnum.ACCESS_TOKEN) && {
        value: 'accesstoken',
        title: 'Access Token',
        content: <GenerateAccessToken />,
      },
    stripePromise &&
      ability &&
      ability.can(ActionsEnum.READ, SubjectsEnum.CARDS) && {
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
  const defaultTab = router.query.tab as string;
  const selectedTab = validTabValues.includes(defaultTab)
    ? defaultTab
    : ability && ability.can(ActionsEnum.READ, SubjectsEnum.ACCESS_TOKEN)
    ? 'accesstoken'
    : 'addcard';

  return <OutlinedTabs defaultValue={selectedTab} items={tabItems} />;
}
