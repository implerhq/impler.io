import Script from 'next/script';
import { createGetInitialProps } from '@mantine/next';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Script src="http://127.0.0.1:4701/embed.umd.min.js" strategy="beforeInteractive" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export const getInitialProps = createGetInitialProps();
