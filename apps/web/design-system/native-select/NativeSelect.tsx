import { NativeSelect as MantineSelect, SelectItem, Variants } from '@mantine/core';

interface NativeSelectProps {
  placeholder?: string;
  data: (string | SelectItem)[];
  register?: any;
  label?: string;
  error?: string;
  required?: boolean;
  autoFocus?: boolean;
  onFocus?: () => void;
  variant?: Variants<'default' | 'filled' | 'unstyled'>;
}

export function NativeSelect({
  error,
  required,
  placeholder,
  data,
  register,
  label,
  autoFocus,
  onFocus,
  variant,
}: NativeSelectProps) {
  return (
    <MantineSelect
      error={error}
      data={data}
      label={label}
      variant={variant}
      onFocus={onFocus}
      required={required}
      autoFocus={autoFocus}
      data-haslabel={!!label}
      placeholder={placeholder}
      {...(register || {})}
    />
  );
}
