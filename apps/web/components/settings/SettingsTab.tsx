import { Tabs } from '@mantine/core';

import { GenerateAccessToken } from './GenerateAccessToken';

export function SettingsTab() {
  return (
    <Tabs mt={2} value="accesstoken">
      <Tabs.List>
        <Tabs.Tab value="accesstoken">Access Token</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="accesstoken" pt="xs">
        <GenerateAccessToken />
      </Tabs.Panel>
    </Tabs>
  );
}
