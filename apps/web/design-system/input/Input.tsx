import { TextInput as MantineInput } from '@mantine/core';
import useStyles from './Input.styles';

interface InputProps {
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  register?: any;
}

export function Input({ disabled, error, placeholder, register }: InputProps) {
  const { classes } = useStyles();

  return (
    <MantineInput placeholder={placeholder} disabled={disabled} error={error} classNames={classes} {...register} />
  );
}
