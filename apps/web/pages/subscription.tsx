import Head from 'next/head';
import React, { useEffect, useState } from 'react';

import { AppLayout } from '@layouts/AppLayout';
import dynamic from 'next/dynamic';
import getConfig from 'next/config';
import { useAppState } from 'store/app.context';
import { MemoryRouter } from 'react-router-dom';
const PlanList = dynamic(async () => (await import('subos-frontend')).PlanList, { ssr: false });
export default function SubscriptionPage() {
  const { publicRuntimeConfig } = getConfig();
  const { profileInfo } = useAppState();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    (async () => {
      const { configureSubOS, getApiBaseUrl, getProjectId } = await import('subos-frontend');
      
      const apiEndpoint = publicRuntimeConfig?.NEXT_PUBLIC_SUBOS_API_ENDPOINT || publicRuntimeConfig?.NEXT_PUBLIC_API_BASE_URL;
      const projectId = profileInfo?._projectId || publicRuntimeConfig?.NEXT_PUBLIC_SUBOS_PROJECT_ID || '';
      const stripeKey = publicRuntimeConfig?.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
      
      console.log('🔧 Subscription Page - SubOS Configuration:');
      console.log('API Endpoint:', apiEndpoint);
      console.log('Project ID:', projectId);
      console.log('Stripe Key Present:', !!stripeKey);
      
      configureSubOS({
        apiEndpoint,
        projectId,
        stripePublishableKey: stripeKey,
      });
      
      // Verify configuration after setting
      console.log('✅ Post-config verification:');
      console.log('Configured API Base URL:', getApiBaseUrl());
      console.log('Configured Project ID:', getProjectId());
      
      // Small delay to ensure configuration is fully applied
      setTimeout(() => {
        console.log('🚀 PlanList component ready to render');
        setReady(true);
      }, 100);
    })();
  }, [
    publicRuntimeConfig?.NEXT_PUBLIC_SUBOS_API_ENDPOINT,
    publicRuntimeConfig?.NEXT_PUBLIC_API_BASE_URL,
    publicRuntimeConfig?.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    publicRuntimeConfig?.NEXT_PUBLIC_SUBOS_PROJECT_ID,
    profileInfo?._projectId,
  ]);

  return (
    <>
      <Head>
        <title>{`Subscription | Impler`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={'/favicon-dark.ico'} />
        <meta name="description" content="Choose a plan for your subscription" />
      </Head>
      <div>
        <h1>Choose a Plan</h1>
        {ready && (
          <MemoryRouter>
            <PlanList />
          </MemoryRouter>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: 'Subscription',
    },
  };
}

// Attach default layout
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
SubscriptionPage.Layout = AppLayout;
