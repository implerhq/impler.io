import Script from 'next/script';
import { createGetInitialProps } from '@mantine/next';
import Document, { Head, Html, Main, NextScript } from 'next/document';

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
          <Script type="text/javascript" src={process.env.NEXT_PUBLIC_EMBED_URL} strategy="beforeInteractive" />
        </body>
      </Html>
    );
  }
}
