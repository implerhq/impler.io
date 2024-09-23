import { Stack, Title } from '@mantine/core';

import { Can } from 'store/ability.context';
import { AppLayout } from '@layouts/AppLayout';
import { Activities } from '@components/import-feed/Activities';
import { History } from '@components/import-feed/History';
import { ActionsEnum, SubjectsEnum } from '@config';

export default function ImportFeed() {
  return (
    <>
      <Title order={2} mb="sm">
        Activities
      </Title>
      <Stack spacing="lg">
        <Activities />
        <Can I={ActionsEnum.READ} a={SubjectsEnum.ANALYTICS}>
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
