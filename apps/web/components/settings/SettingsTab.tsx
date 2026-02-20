import { Tabs } from '@mantine/core';
import { GenerateAccessToken } from './GenerateAccessToken';
import { SecuritySettings } from './SecuritySettings';

export function SettingsTab() {
  return (
    <Tabs mt={2} defaultValue="accesstoken">
      <Tabs.List>
        <Tabs.Tab value="accesstoken">Access Token</Tabs.Tab>
        <Tabs.Tab value="security">Security</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="accesstoken" pt="xs">
        <GenerateAccessToken />
      </Tabs.Panel>
      <Tabs.Panel value="security" pt="xs">
        <SecuritySettings />
      </Tabs.Panel>
    </Tabs>
  );
}
