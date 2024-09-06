import { Title } from '@mantine/core';
import { AppLayout } from '@layouts/AppLayout';
import { TeamMembersTab } from './TeamMembersTab';

export default function TeamMembers() {
  return (
    <>
      <Title order={2}>Team Members</Title>
      <TeamMembersTab />
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      title: 'Team Members',
    },
  };
}

TeamMembers.Layout = AppLayout;
