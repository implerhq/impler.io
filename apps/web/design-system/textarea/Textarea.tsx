import { Textarea as MantineTextarea } from '@mantine/core';

interface TextareaProps {
  required?: boolean;
  placeholder?: string;
  register?: any;
  label?: string;
  autosize?: boolean;
  minRows?: number;
  maxRows?: number;
  description?: string;
}

export function Textarea({
  description,
  required,
  placeholder,
  register,
  autosize,
  minRows,
  maxRows,
  label,
}: TextareaProps) {
  return (
    <MantineTextarea
      label={label}
      minRows={minRows}
      maxRows={maxRows}
      autosize={autosize}
      required={required}
      data-haslabel={!!label}
      description={description}
      placeholder={placeholder}
      {...(register || {})}
    />
  );
}
