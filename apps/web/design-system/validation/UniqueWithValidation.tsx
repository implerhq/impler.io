import { MantineSize, Stack, TextInput } from '@mantine/core';
import { Control, Controller, FieldErrors } from 'react-hook-form';

import { IColumn } from '@impler/shared';

interface UniqueWithValidationProps {
  size?: MantineSize;

  index: number;
  control: Control<IColumn>;
  errors?: FieldErrors<IColumn>;
  errorMessagePlaceholder?: string;
}

export function UniqueWithValidation({
  index,
  errors,
  control,
  size = 'sm',
  errorMessagePlaceholder,
}: UniqueWithValidationProps) {
  return (
    <Stack spacing={5}>
      <Controller
        control={control}
        rules={{
          required: 'Unique Key is required',
        }}
        name={`validations.${index}.uniqueKey`}
        render={({ field }) => (
          <TextInput
            size={size}
            placeholder="Unique Key"
            error={(errors?.validations?.[index] as any)?.uniqueKey?.message}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name={`validations.${index}.errorMessage`}
        render={({ field }) => (
          <TextInput
            {...field}
            size={size}
            placeholder={errorMessagePlaceholder}
            error={errors?.validations?.[index]?.errorMessage?.message}
          />
        )}
      />
    </Stack>
  );
}
