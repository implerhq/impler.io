import React from 'react';
import { Text, Stack, Group } from '@mantine/core';

import { Button } from '@ui/button';
import { useAcceptInvitation } from '@hooks/useAcceptInvitation';
import { colors } from '@config';

interface IConfirmInvitationModalProps {
  token: string;
  invitedBy: string;
  projectName: string;
  invitationId: string;
}

export function ConfirmInvitationModal({ invitationId, token, invitedBy, projectName }: IConfirmInvitationModalProps) {
  const { onAcceptClick, isAcceptLoading } = useAcceptInvitation({
    invitationId,
    token,
  });

  return (
    <Stack spacing="sm">
      <Text align="center">
        <Text span color={colors.yellow}>
          {invitedBy}
        </Text>{' '}
        has invited you to join{' '}
        <Text span color={colors.yellow}>
          {projectName}
        </Text>
        . Would you like to accept the invitation?
      </Text>
      <Group noWrap spacing="xs">
        <Button color="red" variant="outline" fullWidth>
          Reject
        </Button>
        <Button fullWidth color="blue" onClick={onAcceptClick} loading={isAcceptLoading}>
          Accept
        </Button>
      </Group>
    </Stack>
  );
}
