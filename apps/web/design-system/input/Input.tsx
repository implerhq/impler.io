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
  type?: 'text' | 'email' | 'number' | 'url';
}

export function Input({
  required,
  type = 'text',
  disabled,
  error,
  placeholder,
  pattern,
  dataAutoFocus,
  register,
}: InputProps) {
  const { classes } = useStyles();

  return (
    <MantineInput
      type={type}
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
