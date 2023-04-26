import { Button } from '@ui/button';
import { Stack, Text } from '@mantine/core';

interface ConfirmDeleteProps {
  onConfirm: () => void;
}

export function ConfirmDelete({ onConfirm }: ConfirmDeleteProps) {
  return (
    <Stack>
      <Text>Are you sure you want to delete this column?</Text>
      <Button type="submit" fullWidth onClick={onConfirm} color="red">
        Delete
      </Button>
    </Stack>
  );
}
