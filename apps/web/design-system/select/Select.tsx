import { NativeSelect as MantineSelect, SelectItem, Variants } from '@mantine/core';
import useStyles from './Select.styles';

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
  const { classes } = useStyles();

  return (
    <MantineSelect
      data={data}
      label={label}
      variant={variant}
      onFocus={onFocus}
      classNames={classes}
      autoFocus={autoFocus}
      placeholder={placeholder}
      {...(register || {})}
    />
  );
}
