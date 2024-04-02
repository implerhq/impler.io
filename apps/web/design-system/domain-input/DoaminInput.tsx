import { ChangeEvent } from 'react';
import { TextInput } from '@mantine/core';
import useStyles from './DomainInput.styles';

interface DomainInputProps {
  label: string;
  error?: string;
  value?: string;
  required?: boolean;
  placeholder: string;
  rightSection?: React.ReactNode;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function DoaminInput(props: DomainInputProps) {
  const { classes } = useStyles({ hasError: !!props.error });

  return <TextInput classNames={classes} {...props} />;
}
