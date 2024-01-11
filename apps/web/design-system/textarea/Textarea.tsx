import { Textarea as MantineTextarea } from '@mantine/core';
import useStyles from './Textarea.styles';

interface TextareaProps {
  required?: boolean;
  placeholder?: string;
  register?: any;
  label?: string;
  autosize?: boolean;
  minRows?: number;
  maxRows?: number;
}

export function Textarea({ required, placeholder, register, autosize, minRows, maxRows, label }: TextareaProps) {
  const { classes } = useStyles();

  return (
    <MantineTextarea
      label={label}
      classNames={classes}
      required={required}
      placeholder={placeholder}
      autosize={autosize}
      minRows={minRows}
      maxRows={maxRows}
      {...(register || {})}
    />
  );
}
