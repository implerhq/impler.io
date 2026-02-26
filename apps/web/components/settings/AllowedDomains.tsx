import React, { useState, useEffect } from 'react';
import { Flex, Text, Space, MultiSelect } from '@mantine/core';
import { Button } from '@ui/button';
import { notify } from '@libs/notify';
import { NOTIFICATION_KEYS } from '@config';
import { useAllowedDomains } from '@hooks/useAllowedDomains';

export function AllowedDomains() {
  const { allowedDomains, isAllowedDomainsLoading, updateAllowedDomains, isAllowedDomainsUpdating } =
    useAllowedDomains();
  const [localDomains, setLocalDomains] = useState<string[]>([]);
  const [dataOptions, setDataOptions] = useState<string[]>([]);

  useEffect(() => {
    if (allowedDomains) {
      setLocalDomains(allowedDomains);
      setDataOptions(allowedDomains);
    }
  }, [allowedDomains]);

  const handleSave = () => {
    updateAllowedDomains({ allowedDomains: localDomains });
  };

  return (
    <Flex direction="column" gap="xs" my="sm" w="100%" maw={800}>
      <Text fw={400}>Restrict API Key usage to specific domains</Text>
      <Text size="sm" color="dimmed" mb="sm">
        Add the origins (e.g. https://example.com) where your widget will be embedded. Leave empty to allow all domains.
      </Text>

      <MultiSelect
        placeholder="Enter domain and press Enter"
        data={dataOptions}
        value={localDomains}
        onChange={setLocalDomains}
        searchable
        creatable
        getCreateLabel={(query) => `+ Add ${query}`}
        onCreate={(query) => {
          const sanitizedQuery = query.replace(/\/$/, '');
          // Check for duplicate
          if (localDomains.includes(sanitizedQuery)) {
            return null;
          }

          try {
            const url = new URL(sanitizedQuery);
            if (url.protocol !== 'http:' && url.protocol !== 'https:') {
              throw new Error();
            }
          } catch (e) {
            notify(NOTIFICATION_KEYS.ERROR_OCCURED, {
              title: 'Invalid domain',
              message: 'Only http:// or https:// origins are allowed.',
            });

            return null;
          }
          setDataOptions((current) => (current.includes(sanitizedQuery) ? current : [...current, sanitizedQuery]));

          return sanitizedQuery;
        }}
        disabled={isAllowedDomainsLoading}
        clearable
      />

      <Space h="md" />
      <Button
        loading={isAllowedDomainsUpdating}
        disabled={isAllowedDomainsLoading}
        onClick={handleSave}
        w="max-content"
      >
        Save Domains
      </Button>
    </Flex>
  );
}
