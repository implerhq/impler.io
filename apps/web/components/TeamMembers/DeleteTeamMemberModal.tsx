import React from 'react';
import { Text, Stack, Group } from '@mantine/core';
import { Button } from '@ui/button';
import { colors } from '@config';

interface IDeleteTeamMemberModalProps {
  userId: string;
  userName: string;
  onDeleteConfirm: () => void;
  onCancel: () => void;
}

export function DeleteTeamMemberModal({ userName, onDeleteConfirm, onCancel }: IDeleteTeamMemberModalProps) {
  return (
    <Stack spacing="sm">
      <Text align="center">
        Are you sure you want to delete the team member{' '}
        <Text span color={colors.yellow}>
          {userName}
        </Text>
        ?
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
