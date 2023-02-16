import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { Signin } from 'components/signin';
interface SigninProps {
  API_BASE_URL: string;
}

export default function SigninPage({ API_BASE_URL }: SigninProps) {
  return (
    <>
      <Head>
        <title>Sign in to Impler</title>
        <meta name="description" content="Build your own workflows" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Signin API_BASE_URL={API_BASE_URL} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<SigninProps> = async () => ({
  props: {
    API_BASE_URL: process.env.API_BASE_URL!,
  },
});
