import useStyles from './PasswordInput.styles';
import { PasswordInput as MantineInput, MantineSize } from '@mantine/core';

interface PasswordInputProps {
  dataAutoFocus?: boolean;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  register?: any;
  icon?: React.ReactNode;
  size?: MantineSize;
  label?: string;
}

export function PasswordInput({
  required,
  disabled,
  error,
  icon,
  placeholder,
  dataAutoFocus,
  size,
  label,
  register,
}: PasswordInputProps) {
  const { classes } = useStyles();

  return (
    <MantineInput
      label={label}
      icon={icon}
      size={size}
      error={error}
      classNames={classes}
      required={required}
      disabled={disabled}
      placeholder={placeholder}
      data-autofocus={dataAutoFocus}
      {...register}
    />
  );
}
