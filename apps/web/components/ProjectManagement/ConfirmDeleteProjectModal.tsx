import React from 'react';
import { Text, Flex, Stack } from '@mantine/core';
import { Button } from '@ui/button';

interface ConfirmDeleteProjectProps {
  projectName: string;
  onDeleteConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteProjectModal({ projectName, onDeleteConfirm, onCancel }: ConfirmDeleteProjectProps) {
  return (
    <Stack>
      <Text>Are you sure you want to delete the project {projectName}?</Text>
      <Text size="sm" color="dimmed" mt="xs">
        This action cannot be undone. All data associated with this project will be permanently removed.
      </Text>
      <Flex gap="sm">
        <Button fullWidth variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button fullWidth color="red" onClick={onDeleteConfirm}>
          Delete Project
        </Button>
      </Flex>
    </Stack>
  );
}
