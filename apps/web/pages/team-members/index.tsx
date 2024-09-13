import { useEffect } from 'react';
import { Title } from '@mantine/core';
import { AppLayout } from '@layouts/AppLayout';
import { ConfirmInvitationModal, TeamMembersTab } from '@components/TeamMembers';
import { getCookie } from '@shared/utils';
import { modals } from '@mantine/modals';
import { CONSTANTS, MODAL_KEYS } from '@config';

export default function TeamMembers() {
  useEffect(() => {
    const invitationUrlCookie = getCookie(CONSTANTS.INVITATION_URL_COOKIE);
    if (invitationUrlCookie) {
      modals.open({
        title: 'Confirm Invitation?',
        id: MODAL_KEYS.ACCEPT_INVITATION,
        modalId: MODAL_KEYS.ACCEPT_INVITATION,
        children: <ConfirmInvitationModal />,
      });
    }
  }, []);

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
