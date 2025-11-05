import Head from 'next/head';
import getConfig from 'next/config';
import { Stack, Title } from '@mantine/core';

import { TEXTS } from '@config';
import { AppLayout } from '@layouts/AppLayout';
import { PlanDetails } from '@components/home/PlanDetails';
import { PlanPricingTable } from '@components/UpgradePlan/Plans/PlansPricingTable';
import { useAppState } from 'store/app.context';
import { useSubOSIntegration } from '@hooks/useSubOSIntegration';
const { publicRuntimeConfig } = getConfig();

export default function Home() {
  const { profileInfo } = useAppState();
  const { subscription } = useSubOSIntegration();

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
        <PlanPricingTable userProfile={profileInfo!} activePlanCode={subscription?.plan.code} />
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
