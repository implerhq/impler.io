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

export async function getServerSideProps() {
  return {
    props: {
      title: 'Activities',
    },
  };
}

ImportFeed.Layout = AppLayout;
