import { useState } from 'react';
import { modals } from '@mantine/modals';
import { Text } from '@mantine/core';
import { Button } from '@ui/button';
import { colors, MODAL_KEYS, TAB_KEYS, TAB_TITLES } from '@config';
import { Members } from './Members';
import { SentInvitations } from './SentInvitations';
import { ProjectInvitationModal } from './ProjectInvitationModal';
import { OutlinedTabs } from '@ui/OutlinedTabs';
import { useAppState } from 'store/app.context';
import { useSentProjectInvitations } from '@hooks/useSentProjectInvitations';
import { useListTeamMembers } from '@hooks/useListTeamMembers';

export function TeamMembersTab() {
  const { profileInfo } = useAppState();
  const { invitationsCount, refetchInvitations } = useSentProjectInvitations();
  const { teamMembersCount } = useListTeamMembers();
  const [activeTab, setActiveTab] = useState(TAB_KEYS.MEMBERS);

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
      children: <ProjectInvitationModal />,
      size: 'lg',
      withCloseButton: true,
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === TAB_KEYS.SENT_INVITATIONS) {
      refetchInvitations();
    }
  };

  const tabItems = [
    {
      value: TAB_KEYS.MEMBERS,
      title: TAB_TITLES[TAB_KEYS.MEMBERS],
      badgeCount: teamMembersCount,
      content: <Members />,
    },
    {
      value: TAB_KEYS.SENT_INVITATIONS,
      title: TAB_TITLES[TAB_KEYS.SENT_INVITATIONS],
      badgeCount: invitationsCount,
      content: <SentInvitations />,
    },
  ];

  return (
    <OutlinedTabs
      defaultValue={TAB_KEYS.MEMBERS}
      value={activeTab}
      onTabChange={handleTabChange}
      items={tabItems}
      inviteButton={<Button onClick={openInviteModal}>Invite to {profileInfo?.projectName}</Button>}
    />
  );
}
