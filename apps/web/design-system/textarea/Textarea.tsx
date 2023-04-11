import { Textarea as MantineTextarea } from '@mantine/core';
import useStyles from './Textarea.styles';

interface TextareaProps {
  required?: boolean;
  placeholder?: string;
  register?: any;
}

export function Textarea({ required, placeholder, register }: TextareaProps) {
  const { classes } = useStyles();

  return <MantineTextarea classNames={classes} required={required} placeholder={placeholder} {...(register || {})} />;
}
