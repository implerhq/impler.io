import { Stack } from '@mantine/core';
import { modals } from '@mantine/modals';

import { Input } from '@ui/input';
import { Button } from '@ui/button';
import { MODAL_KEYS, MODAL_TITLES } from '@config';

function CreateImportForm() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    modals.close(MODAL_KEYS.IMPORT_CREATE);
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
      id: MODAL_KEYS.IMPORT_CREATE,
      title: MODAL_TITLES.IMPORT_CREATE,
      children: <CreateImportForm />,
    });
  }

  return {
    onCreateClick,
  };
}
