import { TextInput as MantineInput, MantineSize } from '@mantine/core';

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
      autoFocus={autoFocus}
      data-haslabel={!!label}
      placeholder={placeholder}
      rightSection={rightSection}
      {...register}
    />
  );
}
