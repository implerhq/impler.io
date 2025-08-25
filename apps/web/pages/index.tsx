import Head from 'next/head';
import getConfig from 'next/config';
import { Stack, Title } from '@mantine/core';

import { TEXTS } from '@config';
import { AppLayout } from '@layouts/AppLayout';
import { PlanDetails } from '@components/home/PlanDetails';
import { ImportCount } from '@components/home/ImportCount';

const { publicRuntimeConfig } = getConfig();

export default function Home() {
  return (
    <>
      <Head>
        <meta name="og:image" content="/banner.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{`Dashboard | Impler`}</title>
        <link rel="icon" href={'/favicon-dark.ico'} />
        <meta name="description" content={TEXTS.SEO_DESCRIPTION} />
        <meta name="og:title" content={TEXTS.SEO_TITLE} />
        <meta name="og:description" content={TEXTS.SEO_DESCRIPTION} />
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
