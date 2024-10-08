import getConfig from 'next/config';
import { useEffect, useState } from 'react';

import { Flex, Title, useMantineColorScheme } from '@mantine/core';
import { track } from '@libs/amplitude';
import { colors } from '@config';
import { NativeSelect } from '@ui/native-select';
import { IntegrationEnum } from '@impler/shared';
import { IntegrationTabs } from './IntegrationTabs';
import { integrationData } from './IntegrationData';

interface IIntegrationModalProps {
  templateId: string;
  projectId: string;
  accessToken: string;
  integrations: IntegrationEnum;
}

const { publicRuntimeConfig } = getConfig();

export function IntegrationModal({ accessToken, projectId, templateId, integrations }: IIntegrationModalProps) {
  const { colorScheme } = useMantineColorScheme();
  const [selectedTab, setSelectedTab] = useState<string>('Add Script');
  const [integration, setIntegration] = useState<IntegrationEnum>(
    (integrations as IntegrationEnum) || IntegrationEnum.JAVASCRIPT
  );

  useEffect(() => {
    setSelectedTab(Object.keys(integrationData[integration])[0]);
  }, [integration]);

  const onIntegrationFrameworkChange = (value: string) => {
    track({
      name: 'CHANGE INTEGRATION FRAMEWORK',
      properties: {
        framework: value,
      },
    });
    setIntegration(value as IntegrationEnum);
  };

  const onIntegrationStepChange = (newStep: string) => {
    track({
      name: 'CHANGE INTEGRATION STEPS',
      properties: {
        step: newStep,
      },
    });
    setSelectedTab(newStep);
  };

  const tabs = Object.keys(integrationData[integration]);

  return (
    <>
      <Flex justify="space-between" mb="sm">
        <Title order={3} color={colorScheme === 'dark' ? colors.StrokeLight : colors.StrokeDark}>
          Integrate
        </Title>
        <NativeSelect
          data={[IntegrationEnum.JAVASCRIPT, IntegrationEnum.REACT, IntegrationEnum.ANGULAR, IntegrationEnum.BUBBLE]}
          onChange={onIntegrationFrameworkChange}
          variant="default"
        />
      </Flex>

      <IntegrationTabs
        value={selectedTab}
        onTabChange={onIntegrationStepChange}
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
