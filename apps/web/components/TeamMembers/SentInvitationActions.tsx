import React from 'react';
import { Menu, UnstyledButton, useMantineTheme } from '@mantine/core';
import { MenuOption } from '@assets/icons/MenuOption.icon';
import { colors } from '@config';
import { CancelIcon } from '@assets/icons/Cancel.icon';
import { CopyIcon } from '@assets/icons/Copy.icon';

export function SentInvitationActions() {
  const theme = useMantineTheme();

  return (
    <Menu width="sm" position="right" withArrow>
      <Menu.Target>
        <UnstyledButton>
          <MenuOption size="lg" color={theme.colorScheme === 'dark' ? colors.BGPrimaryLight : colors.BGPrimaryDark} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          icon={<CopyIcon />}
          // onClick={() => handleCopyInvitationLink(invitation._id)}
        >
          Copy Invitation Link
        </Menu.Item>
        <Menu.Item
          color="red"
          icon={<CancelIcon />}
          // onClick={() => handleCancelInvitation(invitation._id)}
        >
          Cancel Invitation
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
