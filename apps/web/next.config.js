/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_EMBED_URL: process.env.NEXT_PUBLIC_EMBED_URL,
    NEXT_PUBLIC_AMPLITUDE_ID: process.env.NEXT_PUBLIC_AMPLITUDE_ID,
    NEXT_PUBLIC_TAWK_PROPERTY_ID: process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID,
    NEXT_PUBLIC_TAWK_WIDGET_ID: process.env.NEXT_PUBLIC_TAWK_WIDGET_ID,
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
    NEXT_PUBLIC_OPENREPLAY_KEY: process.env.NEXT_PUBLIC_OPENREPLAY_KEY,
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    NEXT_PUBLIC_ONBOARDING_TOKEN: process.env.NEXT_PUBLIC_ONBOARDING_TOKEN,
    NEXT_PUBLIC_PAYMENT_GATEWAY_URL: process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
  sentry: {
    hideSourceMaps: true,
  },
};

module.exports = withSentryConfig(nextConfig);
