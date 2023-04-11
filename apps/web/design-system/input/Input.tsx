import { TextInput as MantineInput } from '@mantine/core';
import useStyles from './Input.styles';

interface InputProps {
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  register?: any;
  pattern?: string;
}

export function Input({ disabled, error, placeholder, pattern, register }: InputProps) {
  const { classes } = useStyles();

  return (
    <MantineInput
      placeholder={placeholder}
      disabled={disabled}
      pattern={pattern}
      error={error}
      classNames={classes}
      {...register}
    />
  );
}
