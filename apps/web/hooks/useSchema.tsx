import { useState } from 'react';
import { Group, Stack } from '@mantine/core';
import { modals } from '@mantine/modals';

import { Input } from '@ui/input';
import { Button } from '@ui/button';
import { MODAL_KEYS, MODAL_TITLES } from '@config';
import { MultiSelect } from '@ui/multi-select';
import { Select } from '@ui/select';
import { Textarea } from '@ui/textarea';
import { Checkbox } from '@ui/checkbox';

function AddColumnForm() {
  const [type, setType] = useState<'string' | 'number' | 'select' | 'date' | 'regexp' | 'email'>('string');
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    modals.close(MODAL_KEYS.IMPORT_CREATE);
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing="xs">
        <Group spacing="xs" grow>
          <Input placeholder="Name of the column" />
          <MultiSelect
            data={[]}
            placeholder="Excel column keys"
            creatable
            clearable
            searchable
            getCreateLabel={(query) => `+ ${query}`}
          />
        </Group>
        <Select
          data={[
            {
              label: 'String',
              value: 'string',
            },
            {
              label: 'Number',
              value: 'number',
            },
            {
              label: 'Select',
              value: 'select',
            },
            {
              label: 'Date',
              value: 'date',
            },
            {
              label: 'Boolean',
              value: 'boolean',
            },
            {
              label: 'Regular Expression',
              value: 'regexp',
            },
            {
              label: 'Email',
              value: 'email',
            },
          ]}
          placeholder="Type"
          register={{
            value: type,
            onChange: (e: React.ChangeEvent<HTMLSelectElement>) => setType(e.target.value as any),
          }}
        />
        {type === 'regexp' && (
          <>
            <Input placeholder="Regular expression" />
            <Textarea autosize minRows={2} placeholder="Regular expression description" />
          </>
        )}
        {type === 'select' && (
          <MultiSelect
            data={[]}
            placeholder="Select Values"
            creatable
            clearable
            searchable
            getCreateLabel={(query) => `+ Add ${query}`}
          />
        )}
        <Group spacing="xs">
          <Checkbox label="Is Required?" />
          {type !== 'select' && <Checkbox label="Is Unique?" />}
        </Group>
        <Button type="submit" fullWidth>
          Create
        </Button>
      </Stack>
    </form>
  );
}

export function useSchema() {
  function onAddColumnClick() {
    modals.open({
      id: MODAL_KEYS.COLUMN_CREATE,
      title: MODAL_TITLES.COLUMN_CREATE,
      children: <AddColumnForm />,
    });
  }

  return {
    onAddColumnClick,
  };
}
