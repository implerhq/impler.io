import { NativeSelect as MantineSelect, SelectItem } from '@mantine/core';
import useStyles from './Select.styles';

interface SelectProps {
  placeholder?: string;
  data: SelectItem[];
  register?: any;
}

export function Select({ placeholder, data, register }: SelectProps) {
  const { classes } = useStyles();

  return <MantineSelect data={data} classNames={classes} placeholder={placeholder} {...(register || {})} />;
}
