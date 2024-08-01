import { Checkbox as MantineCheckbox, MantineNumberSize } from '@mantine/core';
import useStyles from './Checkbox.styles';
import Link from 'next/link'; // Import Link component
import { ReactNode } from 'react';

interface CheckboxProps {
  label?: string | ReactNode;
  defaultChecked?: boolean;
  register?: any;
  checked?: boolean;
  description?: string;
  size?: MantineNumberSize;
  link?: string;
  linkLabel?: string;
}

export function Checkbox({
  label,
  defaultChecked,
  register,
  checked,
  description,
  size,
  link,
  linkLabel,
}: CheckboxProps) {
  const { classes } = useStyles();
  const combinedDescription = link ? (
    <>
      {description}{' '}
      <Link href={link} target="_blank" rel="noopener noreferrer">
        {linkLabel}
      </Link>
    </>
  ) : (
    description
  );

  return (
    <MantineCheckbox
      classNames={classes}
      defaultChecked={defaultChecked}
      checked={checked}
      label={label}
      size={size}
      description={combinedDescription}
      {...register}
    />
  );
}
