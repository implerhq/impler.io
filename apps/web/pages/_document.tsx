import Script from 'next/script';
import getConfig from 'next/config';
import { createGetInitialProps } from '@mantine/next';
import Document, { DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript } from 'next/document';

const { publicRuntimeConfig } = getConfig();
const getInitialProps = createGetInitialProps();
const isAuthPage = (pathname: string) => /^\/auth\/.+/gm.test(pathname);

interface MyDocumentProps extends DocumentInitialProps {
  isAuthPage: boolean;
}

export default class _Document extends Document<MyDocumentProps> {
  static getInitialProps = async (ctx: DocumentContext) => {
    const initialprops = await getInitialProps(ctx);
    const { pathname } = ctx;

    return { ...initialprops, isAuthPage: isAuthPage(pathname) };
  };

  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/favicon-light.ico" />
          {publicRuntimeConfig.NEXT_PUBLIC_GTM_ID && this.props.isAuthPage && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${publicRuntimeConfig.NEXT_PUBLIC_GTM_ID}')
              `,
              }}
            />
          )}
          {publicRuntimeConfig.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && this.props.isAuthPage && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${publicRuntimeConfig.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  
                  gtag('config', '${publicRuntimeConfig.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');
                  `,
                }}
              />
            </>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
          {publicRuntimeConfig.NEXT_PUBLIC_EMBED_URL && <Script type="text/javascript" src={publicRuntimeConfig.NEXT_PUBLIC_EMBED_URL} strategy="beforeInteractive" />}
        </body>
      </Html>
    );
  }
}
