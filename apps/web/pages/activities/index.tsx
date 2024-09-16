import { Stack, Title } from '@mantine/core';

import { AppLayout } from '@layouts/AppLayout';
import { Activities } from '@components/import-feed/Activities';
import { History } from '@components/import-feed/History';
import { Can } from 'store/ability.context';

export default function ImportFeed() {
  return (
    <>
      <Title order={2} mb="sm">
        Activities
      </Title>
      <Stack spacing="lg">
        <Activities />
        <Can I="read" a="Analytics">
          <History />
        </Can>
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
