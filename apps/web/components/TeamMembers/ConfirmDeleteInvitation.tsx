import { Stack, Group } from '@mantine/core';
import { Button } from '@ui/button';

interface IConfirmDeleteInvitationProps {
  onDeleteConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteInvitation({ onDeleteConfirm, onCancel }: IConfirmDeleteInvitationProps) {
  return (
    <Stack spacing="sm">
      Are you sure you want to cancel this invitation ?
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
