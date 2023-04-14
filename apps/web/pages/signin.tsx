import Head from 'next/head';
import { Signin } from 'components/signin';

interface SigninPageProps {
  API_URL: string;
}

export default function SigninPage({ API_URL }: SigninPageProps) {
  return (
    <>
      <Head>
        <title>Sign in to Impler</title>
        <meta name="description" content="Build your own workflows" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Signin API_URL={API_URL} />
    </>
  );
}

export function getServerSideProps() {
  return {
    props: {
      API_URL: process.env.API_BASE_URL,
    },
  };
}
