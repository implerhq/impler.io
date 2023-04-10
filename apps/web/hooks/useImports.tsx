import { Stack } from '@mantine/core';
import { modals } from '@mantine/modals';

import { Input } from '@ui/input';
import { Button } from '@ui/button';

function CreateImportForm() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    modals.closeAll();
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing="sm">
        <Input placeholder="i.e. Users import" />
        <Button type="submit" fullWidth>
          Create
        </Button>
      </Stack>
    </form>
  );
}

export function useImports() {
  function onCreateClick() {
    modals.open({
      id: 'create-import',
      title: 'Create a new Import',
      children: <CreateImportForm />,
    });
  }

  return {
    onCreateClick,
  };
}
