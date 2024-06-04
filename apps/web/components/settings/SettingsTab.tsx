import { GenerateAccessToken } from './GenerateAccessToken';
import { UserCards } from './UserCards';

import { Tabs } from '@mantine/core';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export function SettingsTab() {
  const router = useRouter();
  const { tab } = router.query;

  const handleTabChange = (value: string) => {
    router.push(`/settings?tab=${value}`);
  };

  useEffect(() => {
    if (!tab) {
      router.replace(`/settings?tab=accesstoken`);
    }
  });

  return (
    <Tabs mt={2} defaultValue="accesstoken" value={(tab as string) || 'accesstoken'} onTabChange={handleTabChange}>
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