import Head from 'next/head';
import { CONSTANTS } from 'config';
import { GetServerSideProps } from 'next';

interface SigninProps {
  API_BASE_URL: string;
}

export default function Signin({ API_BASE_URL }: SigninProps) {
  return (
    <>
      <Head>
        <title>Sign in to Impler</title>
        <meta name="description" content="Build your own workflows" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <a href={API_BASE_URL + CONSTANTS.GITHUB_LOGIN_URL}>Signin with Github</a>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<SigninProps> = async () => ({
  props: {
    API_BASE_URL: process.env.API_BASE_URL!,
  },
});
