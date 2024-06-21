import Head from 'next/head';
import getConfig from 'next/config';
import { Stack, Title } from '@mantine/core';
import { AppLayout } from '@layouts/AppLayout';
import { ImportCount } from '@components/home/ImportCount/ImportCount';
import { PlanDetails } from '@components/home/PlanDetails';

const { publicRuntimeConfig } = getConfig();

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
        {publicRuntimeConfig.NEXT_PUBLIC_PAYMENT_GATEWAY_URL && <PlanDetails />}
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
