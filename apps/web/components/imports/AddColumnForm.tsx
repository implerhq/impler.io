import { Group, Stack } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';

import { Input } from '@ui/input';
import { Button } from '@ui/button';
import { Select } from '@ui/select';
import { Textarea } from '@ui/textarea';
import { Checkbox } from '@ui/checkbox';
import { MultiSelect } from '@ui/multi-select';
import { useEffect } from 'react';
import { IColumn } from '@impler/shared';

interface AddColumnFormProps {
  data?: IColumn;
  onSubmit: (data: IColumn) => void;
}

export function AddColumnForm({ onSubmit, data }: AddColumnFormProps) {
  const { reset, register, control, watch, handleSubmit } = useForm<IColumn>();
  const typeValue = watch('type');

  useEffect(() => {
    if (data) {
      reset({
        isRequired: data.isRequired,
        isUnique: data.isUnique,
        key: data.key,
        name: data.name,
        regex: data.regex,
        regexDescription: data.regexDescription,
        selectValues: data.selectValues,
        type: data.type,
        alternateKeys: data.alternateKeys,
      });
    }
  }, [data]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing="xs">
        <Group spacing="xs" grow>
          <Input placeholder="Name of the column" register={register('name')} />
          <Input placeholder="Column Key" register={register('key')} />
        </Group>
        <Controller
          name="alternateKeys"
          control={control}
          render={({ field: { value, onChange } }) => (
            <MultiSelect
              placeholder="Excel column keys"
              creatable
              clearable
              searchable
              getCreateLabel={(query) => `+ ${query}`}
              data={Array.isArray(value) ? value : []}
              value={value}
              onCreate={(newItem) => {
                onChange([...(Array.isArray(value) ? value : []), newItem]);

                return newItem;
              }}
              onChange={onChange}
            />
          )}
        />
        <Select
          data={[
            {
              label: 'String',
              value: 'String',
            },
            {
              label: 'Number',
              value: 'Number',
            },
            {
              label: 'Select',
              value: 'Select',
            },
            {
              label: 'Date',
              value: 'Date',
            },
            {
              label: 'Boolean',
              value: 'Boolean',
            },
            {
              label: 'Regular Expression',
              value: 'Regex',
            },
            {
              label: 'Email',
              value: 'Email',
            },
            {
              label: 'Any',
              value: 'Any',
            },
          ]}
          placeholder="Type"
          register={register('type')}
        />
        {typeValue === 'regexp' && (
          <>
            <Input placeholder="Regular expression" register={register('regex')} />
            <Textarea
              autosize
              minRows={2}
              placeholder="Regular expression description"
              register={register('regexDescription')}
            />
          </>
        )}
        {typeValue === 'Select' && (
          <Controller
            name="selectValues"
            control={control}
            render={({ field: { value, onChange } }) => (
              <MultiSelect
                placeholder="Select Values"
                creatable
                clearable
                searchable
                getCreateLabel={(query) => `+ Add ${query}`}
                data={Array.isArray(value) ? value : []}
                value={value}
                onCreate={(newItem) => {
                  onChange([...(Array.isArray(value) ? value : []), newItem]);

                  return newItem;
                }}
                onChange={onChange}
              />
            )}
          />
        )}
        <Group spacing="xs">
          <Checkbox label="Is Required?" register={register('isRequired')} />
          {typeValue !== 'select' && <Checkbox label="Is Unique?" register={register('isUnique')} />}
        </Group>
        <Button type="submit" fullWidth>
          Create
        </Button>
      </Stack>
    </form>
  );
}
