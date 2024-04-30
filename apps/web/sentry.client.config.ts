import * as Sentry from '@sentry/nextjs';
// import getConfig from 'next/config';

// const { publicRuntimeConfig } = getConfig();

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
