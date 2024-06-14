import { GenerateAccessToken } from './GenerateAccessToken';
import { UserCards } from './UserCards';

import { Tabs } from '@mantine/core';
import { useRouter } from 'next/router';

export function SettingsTab() {
  const router = useRouter();

  return (
    <Tabs mt={2} defaultValue={(router.query.tab as string) || 'accesstoken'}>
      <Tabs.List>
        <Tabs.Tab value="accesstoken">Access Token</Tabs.Tab>
        <Tabs.Tab value="addcard">Cards</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="accesstoken" pt="xs">
        <GenerateAccessToken />
      </Tabs.Panel>

      <Tabs.Panel value="addcard" pt="xs">
        <UserCards />
      </Tabs.Panel>
    </Tabs>
  );
}
