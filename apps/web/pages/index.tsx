import { ImportCount } from '@components/home/ImportCount/ImportCount';
import { PlanDetails } from '@components/home/PlanDetails';
import { AppLayout } from '@layouts/AppLayout';
import { Divider, Stack, Title } from '@mantine/core';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Manage your import and exports at one place" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Stack>
        <Title order={2}>Home</Title>
        <PlanDetails />
        <Divider />
        <ImportCount />
      </Stack>
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: 'Home',
    },
  };
}

Home.Layout = AppLayout;
