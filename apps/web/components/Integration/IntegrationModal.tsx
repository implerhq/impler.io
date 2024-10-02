import getConfig from 'next/config';
import { useEffect, useState } from 'react';
import { Flex, Title, useMantineColorScheme } from '@mantine/core';
import { colors } from '@config';
import { IntegrationEnum } from '@impler/shared';
import { IntegrationTabs } from './IntegrationTabs';
import { integrationData } from './IntegrationData';
import { IntegrationSelector } from './IntegrationSelector';

interface IIntegrationModalProps {
  templateId: string;
  projectId: string;
  accessToken: string;
}

const { publicRuntimeConfig } = getConfig();

export function IntegrationModal({ accessToken, projectId, templateId }: IIntegrationModalProps) {
  const { colorScheme } = useMantineColorScheme();
  const [selectedTab, setSelectedTab] = useState<string>('Add Script');
  const [integration, setIntegration] = useState<IntegrationEnum>(IntegrationEnum.JAVASCRIPT);

  useEffect(() => {
    setSelectedTab(Object.keys(integrationData[integration])[0]);
  }, [integration]);

  const tabs = Object.keys(integrationData[integration]);

  return (
    <>
      <Flex justify="space-between" mb="sm">
        <Title order={3} color={colorScheme === 'dark' ? colors.StrokeLight : colors.black}>
          Integrate
        </Title>
        <IntegrationSelector integration={integration} setIntegration={setIntegration} />
      </Flex>

      <IntegrationTabs
        value={selectedTab}
        onTabChange={setSelectedTab}
        items={tabs.map((tab) => ({
          id: tab.toLowerCase().replace(/\s+/g, ''),
          value: tab,
          title: tab,
          content: integrationData[integration][tab]({
            accessToken,
            projectId,
            templateId,
            embedScriptUrl: publicRuntimeConfig.NEXT_PUBLIC_EMBED_URL,
          }),
        }))}
      />
    </>
  );
}