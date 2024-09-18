import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Group, MantineSize, TextInput, NumberInput, Stack } from '@mantine/core';

import { IColumn } from '@impler/shared';

interface MinMaxValidatorProps {
  size?: MantineSize;

  index: number;
  min?: number;
  max?: number;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  control: Control<IColumn>;
  errors?: FieldErrors<IColumn>;
  errorMessagePlaceholder?: string;
}

export function MinMaxValidator({
  min,
  max,
  index,
  errors,
  control,
  size = 'sm',
  minPlaceholder,
  maxPlaceholder,
  errorMessagePlaceholder,
}: MinMaxValidatorProps) {
  const validateMinMax = (minValue?: number, maxValue?: number) => {
    if (typeof minValue !== 'number' && typeof maxValue !== 'number') {
      return 'Either min or max must be provided';
    }
    if (typeof minValue === 'number' && typeof maxValue === 'number' && Number(maxValue) < Number(minValue)) {
      return 'Max must be greater than or equal to min';
    }

    return true;
  };

  return (
    <Stack spacing={5}>
      <Group spacing={5} noWrap>
        <Controller
          control={control}
          name={`validators.${index}.min`}
          rules={{
            validate: (value, formValues) => validateMinMax(value, (formValues.validators?.[index] as any).max),
          }}
          render={({ field }) => (
            <NumberInput
              size={size}
              min={min}
              placeholder={minPlaceholder}
              error={(errors?.validators?.[index] as any)?.min?.message}
              value={field.value}
              onChange={(value) => (value === '' ? field.onChange(undefined) : field.onChange(value))}
            />
          )}
        />
        <Controller
          control={control}
          name={`validators.${index}.max`}
          rules={{
            validate: (value, formValues) => validateMinMax((formValues.validators?.[index] as any).min, value),
          }}
          render={({ field }) => (
            <NumberInput
              size={size}
              max={max}
              placeholder={maxPlaceholder}
              error={(errors?.validators?.[index] as any)?.max?.message}
              value={field.value}
              onChange={(value) => (value === '' ? field.onChange(undefined) : field.onChange(value))}
            />
          )}
        />
      </Group>
      <Controller
        control={control}
        name={`validators.${index}.errorMessage`}
        render={({ field }) => (
          <TextInput
            size={size}
            placeholder={errorMessagePlaceholder}
            error={(errors?.validators?.[index] as any)?.errorMessage?.message}
            {...field}
          />
        )}
      />
    </Stack>
  );
}
