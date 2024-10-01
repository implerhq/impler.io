import { useEffect, useState } from 'react';
import { Flex, Title } from '@mantine/core';
import { IntegrationSelector } from './IntegrationSelector';
import { IntegrationEnum } from '@impler/shared';
import { IntegrationTabs } from './IntegrationTabs';
import { integrationData } from './IntegrationData';

export function IntegrationModal() {
  const [selectedTab, setSelectedTab] = useState<string>('Add Script');
  const [integration, setIntegration] = useState<IntegrationEnum>(IntegrationEnum.JAVASCRIPT);

  useEffect(() => {
    setSelectedTab(Object.keys(integrationData[integration])[0]);
  }, [integration]);

  const tabs = Object.keys(integrationData[integration]);

  return (
    <>
      <Flex justify="space-between" mb="sm">
        <Title order={3}>Integrate</Title>
        <IntegrationSelector integration={integration} setIntegration={setIntegration} />
      </Flex>

      <IntegrationTabs
        value={selectedTab}
        onTabChange={setSelectedTab}
        items={tabs.map((tab) => ({
          id: tab.toLowerCase().replace(/\s+/g, ''),
          value: tab,
          title: tab,
          content: integrationData[integration][tab],
        }))}
      />
    </>
  );
}
