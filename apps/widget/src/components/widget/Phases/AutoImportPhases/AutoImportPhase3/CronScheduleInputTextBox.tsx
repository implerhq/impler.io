import { TextInput } from '@mantine/core';
import { Control, Controller } from 'react-hook-form';
import { ScheduleFormValues } from '@config';

interface CronScheduleInputProps {
  name: keyof ScheduleFormValues;
  control: Control<ScheduleFormValues, any>;
  onFocus?: () => void;
  onBlur?: () => void;
}

export function CronScheduleInputTextBox({ name, control, onFocus, onBlur }: CronScheduleInputProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextInput
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
          {...field}
          label={name}
          onFocus={(e) => {
            field.onChange(e);
            if (onFocus) onFocus();
          }}
          onBlur={(e) => {
            field.onChange(e);
            if (onBlur) onBlur();
          }}
        />
      )}
    />
  );
}
