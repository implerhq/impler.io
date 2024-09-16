import { MantineSize, TextInput } from '@mantine/core';
import { Control, Controller, FieldErrors } from 'react-hook-form';

import { IColumn } from '@impler/shared';

interface UniqueWithValidatorProps {
  size?: MantineSize;

  index: number;
  control: Control<IColumn>;
  errors?: FieldErrors<IColumn>;
  errorMessagePlaceholder?: string;
}

export function UniqueWithValidator({
  index,
  errors,
  control,
  size = 'sm',
  errorMessagePlaceholder,
}: UniqueWithValidatorProps) {
  return (
    <>
      <Controller
        control={control}
        rules={{
          required: 'Unique Key is required',
        }}
        name={`validators.${index}.uniqueKey`}
        render={({ field }) => (
          <TextInput
            size={size}
            placeholder="Unique Key"
            error={(errors?.validators?.[index] as any)?.uniqueKey?.message}
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name={`validators.${index}.errorMessage`}
        render={({ field }) => (
          <TextInput
            {...field}
            size={size}
            placeholder={errorMessagePlaceholder}
            error={errors?.validators?.[index]?.errorMessage?.message}
          />
        )}
      />
    </>
  );
}
