import React from 'react';
import { Text, Stack, Group } from '@mantine/core';
import { Button } from '@ui/button';
import { colors } from '@config';

interface IRemoveTeamMemberModalProps {
  userId: string;
  userName: string;
  onCancel: () => void;
  onDeleteConfirm: () => void;
}

export function RemoveTeamMemberModal({ userName, onDeleteConfirm, onCancel }: IRemoveTeamMemberModalProps) {
  return (
    <Stack spacing="sm">
      <Text align="center">
        Are you sure you want to remove{' '}
        <Text span color={colors.yellow} fw="bold">
          {userName}
        </Text>{' '}
        from the team?
      </Text>
      <Group noWrap spacing="xs">
        <Button color="red" variant="outline" fullWidth onClick={onCancel}>
          Cancel
        </Button>
        <Button fullWidth color="blue" onClick={onDeleteConfirm}>
          Confirm
        </Button>
      </Group>
    </Stack>
  );
}
