import { TransactionHistory } from '@components/home/TransactionHistory';
import { AppLayout } from '@layouts/AppLayout';
import ImportFeed from 'pages/activities';

export default function Transactions() {
  return (
    <>
      <TransactionHistory />
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: 'Transactions',
    },
  };
}

ImportFeed.Layout = AppLayout;
