import { GetServerSideProps } from 'next';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Web Portal for Impler</title>
        <meta name="description" content="Manage your import and exports at one place" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/imports',
      permanent: false,
    },
  };
};
