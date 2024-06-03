import { Checkbox as MantineCheckbox } from '@mantine/core';
import useStyles from './Checkbox.styles';

interface CheckboxProps {
  label?: string;
  defaultChecked?: boolean;
  register?: any;
  checked?: boolean;
}

export function Checkbox({ label, defaultChecked, register, checked }: CheckboxProps) {
  const { classes } = useStyles();

  return (
    <MantineCheckbox
      classNames={classes}
      defaultChecked={defaultChecked}
      checked={checked}
      label={label}
      {...register}
    />
  );
}
