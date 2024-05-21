import { Tabs } from '@mantine/core';
import { GenerateAccessToken } from './GenerateAccessToken';
import { UserCards } from './UserCards';
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
    <Tabs mt={20} defaultValue="accesstoken" value={(tab as string) || 'accesstoken'} onTabChange={handleTabChange}>
      <Tabs.List>
        <Tabs.Tab value="accesstoken">Regnerate Access Token</Tabs.Tab>
        <Tabs.Tab value="addcard">Add Card</Tabs.Tab>
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
