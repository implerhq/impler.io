import { Stack, Title } from '@mantine/core';

import { AppLayout } from '@layouts/AppLayout';
import { Activities } from '@components/import-feed/Activities';
import { History } from '@components/import-feed/History';

export default function ImportFeed() {
  return (
    <>
      <Title order={2} mb="sm">
        Activities
      </Title>
      <Stack spacing="lg">
        <Activities />
        <History />
      </Stack>
    </>
  );
}

ImportFeed.Layout = AppLayout;
