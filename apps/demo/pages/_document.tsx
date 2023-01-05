import Script from 'next/script';
import { createGetInitialProps } from '@mantine/next';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { variables } from '@config';

const getInitialProps = createGetInitialProps();
export default class _Document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
          <Script src={variables.WIDGET_EMBED_PATH} strategy="beforeInteractive" />
        </body>
      </Html>
    );
  }
}
