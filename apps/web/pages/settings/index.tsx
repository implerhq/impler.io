import { useClipboard } from '@mantine/hooks';
import { Flex, Title, Text, ActionIcon, Tooltip } from '@mantine/core';

import { Input } from '@ui/input';
import { Button } from '@ui/button';
import { AppLayout } from '@layouts/AppLayout';
import { useSettings } from '@hooks/useSettings';
import { CopyIcon } from '@assets/icons/Copy.icon';
import { CheckIcon } from '@assets/icons/Check.icon';

export default function Settings() {
  const { accessToken, regenerateAccessToken, isAccessTokenRegenerating } = useSettings();
  const clipboardApiKey = useClipboard({ timeout: 1000 });

  return (
    <>
      <>
        <Title order={2}>Settings</Title>
        <Flex direction="column" gap="xs" my="sm" w="max-content">
          <Title order={3}>Access Token</Title>
          <Text fw={400}>Use this token to interact with Impler API</Text>
          <Input
            type="password"
            register={{
              value: accessToken || '',
              onChange: () => {},
            }}
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
    </>
  );
}

Settings.Layout = AppLayout;
