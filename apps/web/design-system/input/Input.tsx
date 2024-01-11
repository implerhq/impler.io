import { TextInput as MantineInput, MantineSize } from '@mantine/core';
import useStyles from './Input.styles';

interface InputProps {
  required?: boolean;
  error?: string;
  register?: any;
  label?: string;
  pattern?: string;
  size?: MantineSize;
  disabled?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
  autoFocus?: boolean;
  rightSection?: React.ReactNode;
  type?: 'text' | 'email' | 'number' | 'url' | 'search' | 'password';
}

export function Input({
  error,
  icon,
  size,
  label,
  pattern,
  register,
  disabled,
  required,
  autoFocus,
  placeholder,
  rightSection,
  type = 'text',
}: InputProps) {
  const { classes } = useStyles();

  return (
    <MantineInput
      type={type}
      icon={icon}
      size={size}
      label={label}
      error={error}
      pattern={pattern}
      required={required}
      disabled={disabled}
      classNames={classes}
      autoFocus={autoFocus}
      placeholder={placeholder}
      rightSection={rightSection}
      {...register}
    />
  );
}
