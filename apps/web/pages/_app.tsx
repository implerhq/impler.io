import React from 'react';
import Head from 'next/head';
import getConfig from 'next/config';
import App, { AppProps } from 'next/app';
import { Poppins } from '@next/font/google';
import { useLocalStorage } from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { init } from '@amplitude/analytics-browser';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ColorSchemeProvider, MantineProvider, ColorScheme } from '@mantine/core';

import { commonApi } from '@libs/api';
import { notify } from '@libs/notify';
import { track } from '@libs/amplitude';
import { addOpacityToHex } from 'shared/utils';
import { StoreWrapper } from 'store/StoreWrapper';
import { mantineConfig, colors, API_KEYS, ROUTES, NOTIFICATION_KEYS } from '@config';

const { publicRuntimeConfig } = getConfig();

if (typeof window !== 'undefined' && publicRuntimeConfig.NEXT_PUBLIC_AMPLITUDE_ID) {
  init(publicRuntimeConfig.NEXT_PUBLIC_AMPLITUDE_ID, {
    defaultTracking: {
      attribution: false,
    },
  });
}

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      onError: async (err: any) => {
        if (err && err.message === 'Failed to fetch') {
          track({
            name: 'ERROR',
            properties: {
              message: err.message,
            },
          });
          notify(NOTIFICATION_KEYS.ERROR_OCCURED);
          window.location.href = ROUTES.SIGNIN;
        } else if (err && err.statusCode === 401) {
          await commonApi(API_KEYS.LOGOUT as any, {});
          track({
            name: 'LOGOUT',
            properties: {},
          });
          window.location.href = ROUTES.SIGNIN;
        }
      },
    },
  },
});

const poppinsFont = Poppins({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
});

export default function MyApp({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'color-scheme',
    defaultValue: 'dark',
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const Layout = Component.Layout ? Component.Layout : React.Fragment;

  return (
    <>
      <Head>
        <title>Impler</title>
        <meta name="description" content="Build your own workflows" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <QueryClientProvider client={client}>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider
            theme={{ ...mantineConfig, colorScheme, fontFamily: poppinsFont.style.fontFamily }}
            withGlobalStyles
            withNormalizeCSS
          >
            <Notifications />
            <ModalsProvider
              modalProps={{
                styles: {
                  title: {
                    color: colorScheme === 'dark' ? colors.white : colors.black,
                  },
                  content: {
                    backgroundColor: colorScheme === 'dark' ? colors.black : colors.white,
                    borderRadius: 0,
                    boxShadow: 'none',
                    flex: `0 0 40rem !important`,
                  },
                  header: {
                    backgroundColor: colorScheme === 'dark' ? colors.black : colors.white,
                  },
                  overlay: {
                    // eslint-disable-next-line no-magic-numbers
                    backgroundColor: addOpacityToHex(colorScheme === 'dark' ? colors.white : colors.black, 0.2),
                    backdropFilter: 'blur(5px)',
                  },
                  inner: {
                    top: '25%',
                  },
                },
              }}
            >
              <StoreWrapper>
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                <Layout {...(Component.Layout ? { pageProps } : {})}>
                  <Component {...pageProps} />
                </Layout>
              </StoreWrapper>
            </ModalsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </QueryClientProvider>
    </>
  );
}

MyApp.getInitialProps = async (appContext: any) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps };
};
