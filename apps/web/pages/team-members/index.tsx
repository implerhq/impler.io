import { Title } from '@mantine/core';

import { SubjectsEnum } from '@config';
import { AppLayout } from '@layouts/AppLayout';
import { Team } from '@components/TeamMembers';
import { useInvitation } from '@hooks/useInvitation';
import { withProtectedResource } from '@components/hoc';

function TeamMembers() {
  useInvitation();

  return (
    <>
      <Title order={2}>Team Members</Title>
      <Team />
    </>
  );
}

const EnhancedTeamMembers = withProtectedResource(TeamMembers, {
  subject: SubjectsEnum.TEAM_MEMBERS,
});

export default function TeamMembersPage() {
  return <EnhancedTeamMembers />;
}

export async function getServerSideProps() {
  return {
    props: {
      title: 'Team Members',
    },
  };
}

TeamMembersPage.Layout = AppLayout;
