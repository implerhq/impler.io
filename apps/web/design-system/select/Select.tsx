import { NativeSelect as MantineSelect, SelectItem, Variants } from '@mantine/core';

interface SelectProps {
  placeholder?: string;
  data: SelectItem[];
  register?: any;
  label?: string;
  autoFocus?: boolean;
  onFocus?: () => void;
  variant?: Variants<'default' | 'filled' | 'unstyled'>;
}

export function Select({ placeholder, data, register, label, autoFocus, onFocus, variant }: SelectProps) {
  return (
    <MantineSelect
      data={data}
      label={label}
      variant={variant}
      onFocus={onFocus}
      autoFocus={autoFocus}
      data-haslabel={!!label}
      placeholder={placeholder}
      {...(register || {})}
    />
  );
}
