import { Title } from '@mantine/core';
import { AppLayout } from '@layouts/AppLayout';
import { SettingsTab } from '@components/settings/SettingsTab';

export default function Settings() {
  return (
    <>
      <Title order={2}>Settings</Title>

      <SettingsTab />
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: 'Settings',
    },
  };
}

Settings.Layout = AppLayout;
