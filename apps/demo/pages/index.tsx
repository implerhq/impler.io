import React from 'react';
import Header from '@components/Header';
import App from '@components/Home';
import { colors } from '@config';
import { Global } from '@mantine/core';
import Footer from '@components/Footer';
import { QueryClientProvider, QueryClient } from 'react-query';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
    },
  },
});

const links = [
  {
    link: 'https://docs.impler.io',
    label: 'Documentation',
  },
  {
    link: 'https://discord.impler.io',
    label: 'Community',
  },
  {
    link: 'https://github.com/knovator/impler.io',
    label: 'Github',
  },
];
const HEADER_HEIGHT = 70;
const FOOTER_HEIGHT = 70;
const EXTRA_SPACING = 5;
const APP_REDUCE_HEIGHT = HEADER_HEIGHT + FOOTER_HEIGHT + EXTRA_SPACING;

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <Global
        styles={() => ({
          body: {
            backgroundColor: colors.black,
          },
        })}
      />
      <Header links={links} height={HEADER_HEIGHT} />
      <App headerHeight={APP_REDUCE_HEIGHT} />
      <Footer />
    </QueryClientProvider>
  );
}
