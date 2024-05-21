import { CopyIcon } from '@assets/icons/Copy.icon';
import { useSettings } from '@hooks/useSettings';
import { Flex, Input, ActionIcon, CheckIcon, Button, Title, Text, Tooltip } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';

import React from 'react';

export function GenerateAccessToken() {
  const { accessToken, regenerateAccessToken, isAccessTokenRegenerating } = useSettings();
  const clipboardApiKey = useClipboard({ timeout: 1000 });

  return (
    <>
      <Flex direction="column" gap="xs" my="sm" w="max-content">
        <Title order={3}>Access Token</Title>
        <Text fw={400}>Use this token to interact with Impler API</Text>
        <Input
          type="password"
          value={accessToken}
          rightSection={
            <Tooltip label={clipboardApiKey.copied ? 'Copied!' : 'Copy Key'}>
              <ActionIcon variant="transparent" onClick={() => clipboardApiKey.copy(accessToken)}>
                {clipboardApiKey.copied ? <CheckIcon /> : <CopyIcon />}
              </ActionIcon>
            </Tooltip>
          }
        />
      </Flex>
      <Button loading={isAccessTokenRegenerating} onClick={regenerateAccessToken}>
        Regenerate Access Token
      </Button>
    </>
  );
}
