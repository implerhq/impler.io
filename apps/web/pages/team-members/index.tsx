import { Title } from '@mantine/core';

import { AppLayout } from '@layouts/AppLayout';
import { TeamMembersTab } from '@components/TeamMembers';
import { useInvitation } from '@hooks/useInvitation';

export default function TeamMembers() {
  useInvitation();

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
