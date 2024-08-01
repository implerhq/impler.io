import { Checkbox as MantineCheckbox, MantineNumberSize } from '@mantine/core';
import useStyles from './Checkbox.styles';
import Link from 'next/link'; // Import Link component

interface CheckboxProps {
  label?: string;
  defaultChecked?: boolean;
  register?: any;
  checked?: boolean;
  description?: string;
  size?: MantineNumberSize;
  link?: string; // Optional prop for the link URL
  linkLabel?: string; // Optional prop for the link text
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
        {linkLabel || 'Read more'}
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
