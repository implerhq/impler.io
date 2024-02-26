import { useClipboard } from '@mantine/hooks';
import { Flex, Title, Text, ActionIcon, Tooltip, TextInput as Input } from '@mantine/core';

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
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: 'Settings',
    },
  };
}

Settings.Layout = AppLayout;
