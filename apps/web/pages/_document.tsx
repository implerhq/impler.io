import Script from 'next/script';
import getConfig from 'next/config';
import { createGetInitialProps } from '@mantine/next';
import Document, { Head, Html, Main, NextScript } from 'next/document';

const { publicRuntimeConfig } = getConfig();

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
          <Script type="text/javascript" src={publicRuntimeConfig.NEXT_PUBLIC_EMBED_URL} strategy="beforeInteractive" />
        </body>
      </Html>
    );
  }
}
