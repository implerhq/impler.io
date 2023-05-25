import { Stack } from '@mantine/core';

import { AppLayout } from '@layouts/AppLayout';
import { Activities } from '@components/import-feed/Activities';
import { History } from '@components/import-feed/History';

export default function ImportFeed() {
  return (
    <Stack spacing="lg">
      <Activities />
      <History />
    </Stack>
  );
}

ImportFeed.Layout = AppLayout;
