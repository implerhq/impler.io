import { Checkbox as MantineCheckbox, MantineNumberSize } from '@mantine/core';
import useStyles from './Checkbox.styles';
import { ReactNode } from 'react';

interface CheckboxProps {
  label?: string | ReactNode;
  defaultChecked?: boolean;
  register?: any;
  checked?: boolean;
  description?: string;
  size?: MantineNumberSize;
  onChange?: (status: boolean) => void;
}

export function Checkbox({ label, defaultChecked, register, checked, description, size, onChange }: CheckboxProps) {
  const { classes } = useStyles();

  return (
    <MantineCheckbox
      classNames={classes}
      defaultChecked={defaultChecked}
      checked={checked}
      label={label}
      size={size}
      description={description}
      onChange={(e) => onChange?.(e.currentTarget.checked)}
      {...register}
    />
  );
}
