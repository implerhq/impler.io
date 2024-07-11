import Link from 'next/link';
import { Group, Stack, TextInput as Input } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';

import { COLUMN_TYPES } from '@config';
import { DEFAULT_VALUES, IColumn } from '@impler/shared';

import { Button } from '@ui/button';
import { Select } from '@ui/select';
import { Textarea } from '@ui/textarea';
import { Checkbox } from '@ui/checkbox';
import { MultiSelect } from '@ui/multi-select';
import { CustomSelect } from '@ui/custom-select';

interface ColumnFormProps {
  data?: IColumn;
  isLoading?: boolean;
  onSubmit: (data: IColumn) => void;
}

export function ColumnForm({ onSubmit, data, isLoading }: ColumnFormProps) {
  const {
    watch,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IColumn>({
    defaultValues: data,
  });
  const typeValue = watch('type');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing="xs">
        <Group spacing="xs" grow>
          <Input
            required
            label="Column Name"
            {...register('name')}
            error={errors.name?.message}
            placeholder="Name of the column*"
          />
          <Input
            required
            label="Column Key"
            {...register('key')}
            placeholder="Column Key"
            error={errors.key?.message}
          />
        </Group>
        <Controller
          name="alternateKeys"
          control={control}
          render={({ field: { value, onChange } }) => (
            <MultiSelect
              creatable
              clearable
              searchable
              value={value}
              onChange={onChange}
              label="Alternative column keys"
              placeholder="Alternative column keys"
              getCreateLabel={(query) => `+ ${query}`}
              data={Array.isArray(value) ? value : []}
              onCreate={(newItem) => {
                onChange([...(Array.isArray(value) ? value : []), newItem]);

                return newItem;
              }}
            />
          )}
        />
        <Select label="Column Type" data={COLUMN_TYPES} placeholder="Type" register={register('type')} />
        {typeValue === 'Regex' && (
          <>
            <Input
              required
              {...register('regex')}
              label="Regular expression"
              error={errors.regex?.message}
              placeholder="Regular expression"
            />
            <Textarea
              autosize
              minRows={2}
              label="Regular expression description"
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
                creatable
                clearable
                searchable
                label="Select Values"
                placeholder="Select Values"
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
                label="Date Formats"
                placeholder="Valid Date Formats, i.e. DD/MM/YYYY, DD/MM/YY"
                data={['DD/MM/YYYY', 'DD/MM/YY', 'MM/DD/YYYY', 'MM/DD/YY', ...(Array.isArray(value) ? value : [])]}
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
        <Controller
          name="defaultValue"
          control={control}
          render={({ field: { value, onChange } }) => (
            <CustomSelect
              value={value}
              onChange={onChange}
              label="Default Value"
              placeholder="Default Value"
              description={
                <>
                  Value to send in response when cell value is not present.{' '}
                  <Link target="_blank" href="https://docs.impler.io/platform/default-value">
                    Read more
                  </Link>
                </>
              }
              data={DEFAULT_VALUES}
            />
          )}
        />
        <Group spacing="xs">
          <Checkbox label="Required?" register={register('isRequired')} />
          {typeValue !== 'Select' ? (
            <Checkbox label="Unique?" register={register('isUnique')} />
          ) : (
            <Checkbox label="Multi Select?" register={register('allowMultiSelect')} />
          )}
          <Checkbox label="Frozen?" register={register('isFrozen')} />
        </Group>
        <Button type="submit" fullWidth loading={isLoading}>
          {data ? 'Update' : 'Add'}
        </Button>
      </Stack>
    </form>
  );
}
