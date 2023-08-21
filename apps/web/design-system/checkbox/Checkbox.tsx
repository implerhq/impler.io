import { Checkbox as MantineCheckbox } from '@mantine/core';
import useStyles from './Checkbox.styles';

interface CheckboxProps {
  label?: string;
  defaultChecked?: boolean;
  register?: any;
}

export function Checkbox({ label, defaultChecked, register }: CheckboxProps) {
  const { classes } = useStyles();

  return <MantineCheckbox classNames={classes} defaultChecked={defaultChecked} label={label} {...register} />;
}
