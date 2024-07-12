import { TextInput } from '@mantine/core';
import { isValidCronCharacter } from '@util';
import { Control, Controller } from 'react-hook-form';
import { ScheduleFormValues } from '@config';

interface CronScheduleInputProps {
  name: keyof ScheduleFormValues;
  control: Control<ScheduleFormValues>;
}

export function CronScheduleInputTextBox({ name, control }: CronScheduleInputProps) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: isValidCronCharacter,
      }}
      render={({ field }) => (
        <TextInput
          label={String(name)}
          maw={200}
          value={field.value}
          onBlur={(e) => {
            const value = e.target.value.trim();
            field.onChange(value || '*');
            field.onBlur();
          }}
          onChange={(e) => {
            const value = e.target.value;
            field.onChange(value);
          }}
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
