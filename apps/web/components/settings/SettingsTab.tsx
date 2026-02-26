import { useState } from 'react';
import { Tabs } from '@mantine/core';

import { GenerateAccessToken } from './GenerateAccessToken';
import { AllowedDomains } from './AllowedDomains';

export function SettingsTab() {
  const [activeTab, setActiveTab] = useState<string | null>('accesstoken');

  return (
    <Tabs mt={2} value={activeTab} onTabChange={setActiveTab}>
      <Tabs.List>
        <Tabs.Tab value="accesstoken">Access Token</Tabs.Tab>
        <Tabs.Tab value="widgetSecurity">Widget Security</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="accesstoken" pt="xs">
        <GenerateAccessToken />
      </Tabs.Panel>
      <Tabs.Panel value="widgetSecurity" pt="xs">
        <AllowedDomains />
      </Tabs.Panel>
    </Tabs>
  );
}
