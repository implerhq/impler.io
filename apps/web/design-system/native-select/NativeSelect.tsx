import { NativeSelect as MantineSelect, SelectItem, Variants } from '@mantine/core';
import useStyles from './NativeSelect.styles';

interface NativeSelectProps {
  placeholder?: string;
  data: (string | SelectItem)[];
  register?: any;
  label?: string;
  error?: string;
  value?: string;
  required?: boolean;
  autoFocus?: boolean;
  onFocus?: () => void;
  onChange?: (value: string) => void;
  variant?: Variants<'default' | 'filled' | 'unstyled'>;
}

export function NativeSelect({
  error,
  required,
  placeholder,
  data,
  register,
  label,
  value,
  onChange,
  autoFocus,
  onFocus,
  variant,
}: NativeSelectProps) {
  const { classes } = useStyles();

  return (
    <MantineSelect
      data={data}
      value={value}
      error={error}
      label={label}
      variant={variant}
      onFocus={onFocus}
      required={required}
      classNames={classes}
      autoFocus={autoFocus}
      data-haslabel={!!label}
      placeholder={placeholder}
      onChange={(e) => onChange?.(e.target.value)}
      {...(register || {})}
    />
  );
}
