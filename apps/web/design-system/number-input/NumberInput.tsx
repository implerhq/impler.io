import { NumberInput as MantineInput, MantineSize } from '@mantine/core';

interface NumberInputProps {
  error?: string;
  register?: any;
  label?: string;
  required?: boolean;
  size?: MantineSize;
  disabled?: boolean;
  placeholder?: string;
}

export function NumberInput({ size, error, label, required, disabled, register, placeholder }: NumberInputProps) {
  return (
    <MantineInput
      size={size}
      error={error}
      label={label}
      required={required}
      disabled={disabled}
      data-haslabel={!!label}
      placeholder={placeholder}
      {...register}
    />
  );
}
