import React from 'react';
import { Menu, UnstyledButton } from '@mantine/core';
import { MenuIcon } from '@assets/icons/Menu.icon';
import { colors } from '@config';
import { CancelIcon } from '@assets/icons/Cancel.icon';
import { CopyIcon } from '@assets/icons/Copy.icon';
import { useSentProjectInvitations } from '@hooks/useSentProjectInvitations';

interface IInvitation {
  invitationId: string;
}

export function SentInvitationActions(invitation: IInvitation) {
  const { handleCopyInvitationLink, handleCancelInvitation } = useSentProjectInvitations();

  return (
    <Menu width="sm" position="right" withArrow>
      <Menu.Target>
        <UnstyledButton>
          <MenuIcon size="lg" color={colors.BGPrimaryLight} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item icon={<CopyIcon />} onClick={() => handleCopyInvitationLink(invitation.invitationId)}>
          Copy Invitation Link
        </Menu.Item>
        <Menu.Item color="red" icon={<CancelIcon />} onClick={() => handleCancelInvitation(invitation.invitationId)}>
          Revoke Invitation
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
