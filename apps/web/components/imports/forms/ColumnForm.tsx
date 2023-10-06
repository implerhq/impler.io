import { useEffect } from 'react';
import { Group, Stack } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';

import { Input } from '@ui/input';
import { Button } from '@ui/button';
import { Select } from '@ui/select';
import { Textarea } from '@ui/textarea';
import { Checkbox } from '@ui/checkbox';
import { IColumn } from '@impler/shared';
import { MultiSelect } from '@ui/multi-select';
import { COLUMN_TYPES } from '@shared/constants';

interface ColumnFormProps {
  data?: IColumn;
  isLoading?: boolean;
  onSubmit: (data: IColumn) => void;
}

export function ColumnForm({ onSubmit, data, isLoading }: ColumnFormProps) {
  const {
    reset,
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IColumn>();
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
        dateFormats: data.dateFormats,
        type: data.type,
        alternateKeys: data.alternateKeys,
      });
    }
  }, [data, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing="xs">
        <Group spacing="xs" grow>
          <Input placeholder="Name of the column*" required register={register('name')} error={errors.name?.message} />
          <Input placeholder="Column Key*" required error={errors.key?.message} register={register('key')} />
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
        <Select data={COLUMN_TYPES} placeholder="Type" register={register('type')} />
        {typeValue === 'Regex' && (
          <>
            <Input
              placeholder="Regular expression"
              register={register('regex')}
              required
              error={errors.regex?.message}
            />
            <Textarea
              autosize
              minRows={2}
              placeholder="Regular expression description"
              register={register('regexDescription')}
            />
          </>
        )}
        {typeValue === 'Select' ? (
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
        ) : null}
        {typeValue === 'Date' ? (
          <Controller
            name="dateFormats"
            control={control}
            render={({ field: { value, onChange } }) => (
              <MultiSelect
                creatable
                clearable
                searchable
                value={value}
                placeholder="Valid Date Formats, i.e. DD/MM/YYYY, DD/MM/YY"
                data={Array.isArray(value) ? value : []}
                getCreateLabel={(query) => `Add "${query}"`}
                onCreate={(newItem) => {
                  onChange([...(Array.isArray(value) ? value : []), newItem]);

                  return newItem;
                }}
                onChange={onChange}
              />
            )}
          />
        ) : null}
        <Group spacing="xs">
          <Checkbox label="Is Required?" register={register('isRequired')} />
          {typeValue !== 'Select' && <Checkbox label="Is Unique?" register={register('isUnique')} />}
        </Group>
        <Button type="submit" fullWidth loading={isLoading}>
          {data ? 'Update' : 'Add'}
        </Button>
      </Stack>
    </form>
  );
}
