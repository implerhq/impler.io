import useStyles from './NumberInput.styles';
import { NumberInput as MantineInput, MantineSize } from '@mantine/core';

interface NumberInputProps {
  error?: string;
  register?: any;
  required?: boolean;
  size?: MantineSize;
  disabled?: boolean;
  placeholder?: string;
}

export function NumberInput({ size, error, required, disabled, register, placeholder }: NumberInputProps) {
  const { classes } = useStyles();

  return (
    <MantineInput
      size={size}
      error={error}
      required={required}
      disabled={disabled}
      classNames={classes}
      placeholder={placeholder}
      type="number"
      {...register}
    />
  );
}
