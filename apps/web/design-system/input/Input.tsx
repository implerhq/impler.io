import { TextInput as MantineInput } from '@mantine/core';
import useStyles from './Input.styles';

interface InputProps {
  dataAutoFocus?: boolean;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  register?: any;
  pattern?: string;
}

export function Input({ required, disabled, error, placeholder, pattern, dataAutoFocus, register }: InputProps) {
  const { classes } = useStyles();

  return (
    <MantineInput
      data-autofocus={dataAutoFocus}
      required={required}
      placeholder={placeholder}
      disabled={disabled}
      pattern={pattern}
      error={error}
      classNames={classes}
      {...register}
    />
  );
}
