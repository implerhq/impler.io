import { TextInput } from '@mantine/core';
import { isValidCronCharacter } from '@util';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface CronScheduleInputProps<T extends FieldValues> {
  name: keyof T;
  control: Control<T>;
}

export function CronScheduleInputTextBoxes<T extends FieldValues>({ name, control }: CronScheduleInputProps<T>) {
  return (
    <Controller
      name={name as Path<T>}
      control={control}
      rules={{
        validate: (value) => value === '' || isValidCronCharacter(value),
      }}
      render={({ field }) => (
        <TextInput
          label={String(name)}
          maw={200}
          {...field}
          styles={{
            label: {
              textAlign: 'center',
              display: 'block',
            },
            input: {
              textAlign: 'center',
            },
            wrapper: {
              textAlign: 'center',
            },
          }}
        />
      )}
    />
  );
}
