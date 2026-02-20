import { MultiSelect, Stack, Text, Flex } from '@mantine/core';
import { useProject } from '@hooks/useProject';
import React, { useEffect, useState } from 'react';
import { Button } from '@ui/button';
import { NOTIFICATION_KEYS } from '@config';
import { notify } from '@libs/notify';

const validateDomain = (value: string) => {
  const domainWithProtocol = value.startsWith('http') ? value : `http://${value}`;
  try {
    const url = new URL(domainWithProtocol);

    return url.hostname.length > 0 && (url.hostname.includes('.') || url.hostname === 'localhost');
  } catch (e) {
    return false;
  }
};

export function SecuritySettings() {
  const { projects, currentProjectId, updateProject, isUpdateProjectLoading } = useProject();
  const [authDomains, setAuthDomains] = useState<string[]>([]);

  const currentProject = projects?.find((project) => project._id === currentProjectId);

  useEffect(() => {
    if (currentProject?.authDomains) {
      setAuthDomains(currentProject.authDomains);
    } else {
      setAuthDomains([]);
    }
  }, [currentProject]);

  const onSave = () => {
    if (currentProjectId) {
      updateProject({
        projectId: currentProjectId,
        data: {
          authDomains,
        },
      });
    }
  };

  const onAuthDomainsChange = (newValues: string[]) => {
    const lastAdded = newValues[newValues.length - 1];
    if (newValues.length > authDomains.length && lastAdded) {
      if (!validateDomain(lastAdded)) {
        notify(NOTIFICATION_KEYS.ERROR_OCCURED, {
          title: 'Invalid Domain',
          message: 'Please enter a valid domain (e.g., example.com)',
        });

        return;
      }
    }
    setAuthDomains(newValues);
  };

  return (
    <Stack spacing="xs" my="sm">
      <Flex direction="column" gap="xs">
        <Text fw={400}>Allowed Domains</Text>
        <Text size="sm" color="dimmed">
          Specify the domains that are allowed to use your project credentials. If empty, all domains are allowed.
        </Text>
        <MultiSelect
          data={authDomains}
          value={authDomains}
          onChange={onAuthDomainsChange}
          placeholder="e.g. https://example.com"
          searchable
          creatable
          getCreateLabel={(query) => `+ Add ${query}`}
        />
      </Flex>
      <Button loading={isUpdateProjectLoading} onClick={onSave} w="max-content">
        Save Settings
      </Button>
    </Stack>
  );
}
