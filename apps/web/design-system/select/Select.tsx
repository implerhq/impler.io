import { NativeSelect as MantineSelect, SelectItem, Variants } from '@mantine/core';

interface SelectProps {
  placeholder?: string;
  data: SelectItem[];
  register?: any;
  label?: string;
  required?: boolean;
  autoFocus?: boolean;
  onFocus?: () => void;
  variant?: Variants<'default' | 'filled' | 'unstyled'>;
}

export function Select({ required, placeholder, data, register, label, autoFocus, onFocus, variant }: SelectProps) {
  return (
    <MantineSelect
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
