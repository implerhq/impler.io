import { TextInput as MantineInput } from '@mantine/core';
import useStyles from './Input.styles';

interface InputProps {
  required?: boolean;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  register?: any;
  pattern?: string;
}

export function Input({ required, disabled, error, placeholder, pattern, register }: InputProps) {
  const { classes } = useStyles();

  return (
    <MantineInput
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
