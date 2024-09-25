import { useClipboard } from '@mantine/hooks';
import { Flex, Input, ActionIcon, CheckIcon, Text, Tooltip } from '@mantine/core';
import { useSettings } from '@hooks/useSettings';
import { CopyIcon } from '@assets/icons/Copy.icon';

import React from 'react';
import { Button } from '@ui/button';

export function GenerateAccessToken() {
  const { accessToken, regenerateAccessToken, isAccessTokenRegenerating } = useSettings();
  const clipboardApiKey = useClipboard({ timeout: 1000 });

  return (
    <>
      <Flex direction="column" gap="xs" my="sm" w="max-content">
        <Text fw={400}>Use this token to interact with Impler API</Text>
        <Input
          type="password"
          value={accessToken}
          rightSection={
            <Tooltip label={clipboardApiKey.copied ? 'Copied!' : 'Copy Key'}>
              <ActionIcon radius={0} variant="transparent" onClick={() => clipboardApiKey.copy(accessToken)}>
                {clipboardApiKey.copied ? <CheckIcon /> : <CopyIcon />}
              </ActionIcon>
            </Tooltip>
          }
        />
      </Flex>
      <Button loading={isAccessTokenRegenerating} onClick={() => regenerateAccessToken()}>
        Regegenrate Access Token
      </Button>
    </>
  );
}
