import React from 'react';
import { Text, Stack, Flex } from '@mantine/core';
import { Button } from '@ui/button';
import { useAcceptInvitation } from '@hooks/useAcceptInvitation';

export function ConfirmInvitationModal() {
  const { acceptInvitationFromCookie, isAcceptInvitationLoading } = useAcceptInvitation();

  return (
    <Stack spacing="sm">
      <Text align="center">Are you sure you want to accept this invitation?</Text>
      <Flex gap="sm">
        <Button variant="outline" fullWidth onClick={acceptInvitationFromCookie} loading={isAcceptInvitationLoading}>
          Confirm
        </Button>
        <Button fullWidth color="blue">
          Cancel
        </Button>
      </Flex>
    </Stack>
  );
}
