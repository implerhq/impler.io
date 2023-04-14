import Head from 'next/head';
import { Signin } from 'components/signin';

export default function SigninPage() {
  return (
    <>
      <Head>
        <title>Sign in to Impler</title>
        <meta name="description" content="Build your own workflows" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Signin />
    </>
  );
}
