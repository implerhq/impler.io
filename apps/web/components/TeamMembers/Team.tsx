import { useState, useContext } from 'react';
import { Text } from '@mantine/core';
import { modals } from '@mantine/modals';

import { TeamMembers } from './TeamMembers';
import { SentInvitations } from './SentInvitations';
import { TeamInvitationModal } from './TeamInvitationModal';

import { Button } from '@ui/button';
import { useAppState } from 'store/app.context';
import { OutlinedTabs } from '@ui/OutlinedTabs';
import { useTeamMembers } from '@hooks/useTeamMembers';
import { AbilityContext } from 'store/ability.context';
import { ActionsEnum, AppAbility, colors, MODAL_KEYS, SubjectsEnum, TAB_KEYS, TAB_TITLES } from '@config';
import { useSentProjectInvitations } from '@hooks/useSentProjectInvitations';

export function Team() {
  const { profileInfo } = useAppState();
  const ability = useContext<AppAbility | null>(AbilityContext);
  const { invitationsCount } = useSentProjectInvitations();
  const { teamMembersCount } = useTeamMembers();
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
      children: <TeamInvitationModal />,
      size: 'lg',
      withCloseButton: true,
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const tabItems = [
    {
      value: TAB_KEYS.MEMBERS,
      title: TAB_TITLES[TAB_KEYS.MEMBERS],
      badgeCount: teamMembersCount,
      content: <TeamMembers />,
    },
    {
      value: TAB_KEYS.SENT_INVITATIONS,
      title: TAB_TITLES[TAB_KEYS.SENT_INVITATIONS],
      badgeCount: invitationsCount,
      content: <SentInvitations />,
    },
  ];

  const canInvite = ability && ability.can(ActionsEnum.CREATE, SubjectsEnum.TEAM_MEMBERS);

  return (
    <OutlinedTabs
      defaultValue={TAB_KEYS.MEMBERS}
      value={activeTab}
      onTabChange={handleTabChange}
      items={tabItems}
      inviteButton={
        <Button onClick={canInvite ? openInviteModal : undefined} disabled={!canInvite}>
          Invite to {profileInfo?.projectName}
        </Button>
      }
    />
  );
}
