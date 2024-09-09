import { modals } from '@mantine/modals';
import { Text } from '@mantine/core';
import { Button } from '@ui/button';
import { colors, MODAL_KEYS } from '@config';
import { Members } from 'pages/team-members/Members';
import { SentInvitations } from './SentInvitations';
import { InviteMembersModal } from './InviteMembersModal';
import { InvitationRequests } from './InvitationRequests';
import { OutlinedTabs } from '@ui/OutlinedTabs';
import { useAppState } from 'store/app.context';

export function TeamMembersTab() {
  const { profileInfo } = useAppState();
  const openInviteModal = () => {
    modals.open({
      id: MODAL_KEYS.INVITE_MEMBERS,
      modalId: MODAL_KEYS.INVITE_MEMBERS,
      title: (
        <Text>
          Invite new members in{' '}
          <span style={{ color: colors.yellow, fontWeight: 'bold' }}>{profileInfo?.projectName}</span>
        </Text>
      ),
      children: <InviteMembersModal />,
      size: 'lg',
      withCloseButton: true,
    });
  };

  const tabItems = [
    {
      value: 'members',
      title: 'Members',
      badgeCount: 5,
      content: <Members />,
    },
    {
      value: 'team',
      title: 'Sent Invitations',
      badgeCount: 3,
      content: <SentInvitations />,
    },
    {
      value: 'invitation-requests',
      title: 'Invitation Requests',
      badgeCount: 10,
      content: <InvitationRequests />,
    },
  ];

  return (
    <OutlinedTabs
      defaultValue="members"
      items={tabItems}
      inviteButton={<Button onClick={openInviteModal}>Invite to {profileInfo?.projectName}</Button>}
    />
  );
}
