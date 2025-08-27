// apps/web/design-system/validation/DigitsValidation.tsx
import { Group, MantineSize, NumberInput, Stack, TextInput } from '@mantine/core';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { IColumn } from '@impler/shared';

interface DigitsValidationProps {
  size?: MantineSize;
  index: number;
  minDigits?: number;
  maxDigits?: number;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  control: Control<IColumn>;
  errors?: FieldErrors<IColumn>;
  errorMessagePlaceholder?: string;
}

export function DigitsValidation({
  index,
  errors,
  control,
  size = 'sm',
  minPlaceholder = 'Min digits',
  maxPlaceholder = 'Max digits',
  errorMessagePlaceholder = 'Error message if validation fails',
}: DigitsValidationProps) {
  const validateDigits = (minValue?: number, maxValue?: number) => {
    if (typeof minValue !== 'number' && typeof maxValue !== 'number') {
      return 'Either min or max digits must be provided';
    }
    if (typeof minValue === 'number' && minValue < 1) {
      return 'Minimum digits must be at least 1';
    }
    if (typeof maxValue === 'number' && maxValue < 1) {
      return 'Maximum digits must be at least 1';
    }
    if (typeof minValue === 'number' && typeof maxValue === 'number' && maxValue < minValue) {
      return 'Max digits must be greater than or equal to min digits';
    }

    return true;
  };

  return (
    <Stack spacing={5}>
      <Group spacing={5} noWrap>
        <Controller
          control={control}
          name={`validations.${index}.min`}
          rules={{
            validate: (value, formValues) => validateDigits(value, (formValues.validations?.[index] as any)?.max),
          }}
          render={({ field }) => (
            <NumberInput
              size={size}
              min={1}
              placeholder={minPlaceholder}
              error={(errors?.validations?.[index] as any)?.min?.message}
              value={field.value ? field.value : undefined}
              onChange={(value) => field.onChange(value === '' ? undefined : value)}
            />
          )}
        />
        <Controller
          control={control}
          name={`validations.${index}.max`}
          rules={{
            validate: (value, formValues) => validateDigits((formValues.validations?.[index] as any)?.min, value),
          }}
          render={({ field }) => (
            <NumberInput
              size={size}
              min={1}
              placeholder={maxPlaceholder}
              error={(errors?.validations?.[index] as any)?.max?.message}
              value={field.value ? field.value : undefined}
              onChange={(value) => field.onChange(value === '' ? undefined : value)}
            />
          )}
        />
      </Group>
      <Controller
        control={control}
        name={`validations.${index}.errorMessage`}
        render={({ field }) => (
          <TextInput
            size={size}
            placeholder={errorMessagePlaceholder}
            error={(errors?.validations?.[index] as any)?.errorMessage?.message}
            {...field}
          />
        )}
      />
    </Stack>
  );
}
