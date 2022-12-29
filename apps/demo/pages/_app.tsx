import Head from 'next/head';
import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Impler Demo</title>
        <meta name="description" content="See how easily you can import large spreadsheets" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Component {...pageProps} />
      </MantineProvider>
    </>
  );
}
