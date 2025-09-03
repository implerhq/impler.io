import React from 'react';
import { ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { Global } from '@emotion/react';
import Head from 'next/head';
import getConfig from 'next/config';
import { Poppins } from 'next/font/google';
import App, { AppProps } from 'next/app';
import { ModalsProvider } from '@mantine/modals';
import { init } from '@amplitude/analytics-browser';
import { Notifications } from '@mantine/notifications';
import 'subos-frontend/style.css';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

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
      sessions: false,
      pageViews: false,
      attribution: false,
      fileDownloads: false,
      formInteractions: false,
    },
  });
}

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      onError: async (err: any) => {
        const path = window.location.pathname;
        const isApplicationPath =
          ![ROUTES.SIGNIN, ROUTES.SIGNUP, ROUTES.REQUEST_FORGOT_PASSWORD].includes(path) &&
          !path.startsWith(ROUTES.RESET_PASSWORD) &&
          !path.startsWith('/auth/invitation');
        if (err && err.message === 'Failed to fetch') {
          track({
            name: 'ERROR',
            properties: {
              message: err.message,
            },
          });
          notify(NOTIFICATION_KEYS.ERROR_OCCURED);
          if (isApplicationPath) window.location.href = ROUTES.SIGNIN;
        } else if (err && err.statusCode === 401) {
          await commonApi(API_KEYS.LOGOUT as any, {});
          track({
            name: 'LOGOUT',
            properties: {},
          });
          if (isApplicationPath) window.location.href = ROUTES.SIGNIN;
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const Layout = Component.Layout ? Component.Layout : React.Fragment;

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon-dark.ico" />
        <meta name="og:image" content="/banner.png" />
        <title>Impler | Readymade and scalable data import experience for developers</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <meta name="og:title" content="Impler | Readymade and scalable data import experience for developers" />
        <meta
          name="description"
          content="100% open source data import experience with readymade CSV & Excel import widget"
        />
        <meta
          name="og:description"
          content="100% open source data import experience with readymade CSV & Excel import widget"
        />
      </Head>
      <QueryClientProvider client={client}>
        <ColorSchemeProvider colorScheme={'dark'} toggleColorScheme={() => {}}>
          <StoreWrapper>
            <Global
              styles={{
                /* width */
                '::-webkit-scrollbar': {
                  width: '5px',
                  height: '5px',
                },

                /* Track */
                '::-webkit-scrollbar-track': {
                  boxShadow: 'inset 0 0 3px grey',
                  borderRadius: '10px',
                },

                /* Handle */
                '::-webkit-scrollbar-thumb': {
                  background: colors.TXTGray,
                  borderRadius: '10px',
                },
              }}
            />
            <MantineProvider
              theme={{
                ...mantineConfig,
                colorScheme: 'dark',
                fontFamily: poppinsFont.style.fontFamily,
              }}
              withGlobalStyles
              withNormalizeCSS
            >
              <Notifications />
              <ModalsProvider
                modalProps={{
                  styles: {
                    title: {
                      color: colors.white,
                    },
                    content: {
                      backgroundColor: colors.black,
                      borderRadius: 0,
                      boxShadow: 'none',
                      // flex: `0 0 40rem !important`,
                    },
                    header: {
                      backgroundColor: colors.black,
                    },
                    overlay: {
                      // eslint-disable-next-line no-magic-numbers
                      backgroundColor: addOpacityToHex(colors.white, 0.2),
                      backdropFilter: 'blur(5px)',
                    },
                  },
                }}
              >
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                <Layout {...(Component.Layout ? { pageProps } : {})}>
                  <Component {...pageProps} />
                </Layout>
              </ModalsProvider>
            </MantineProvider>
          </StoreWrapper>
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
