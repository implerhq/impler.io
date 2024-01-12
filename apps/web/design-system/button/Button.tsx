import { PropsWithChildren } from 'react';
import useStyles from './Button.styles';
import { Button as MantineButton, MantineSize } from '@mantine/core';

export type ButtonColors = 'blue' | 'invariant' | 'red' | 'green';
export type ButtonVariants = 'filled' | 'outline';

interface ButtonProps {
  id?: string;
  leftIcon?: any;
  rightIcon?: any;
  color?: ButtonColors;
  size?: MantineSize;
  component?: any;
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariants;
  href?: string;
  fullWidth?: boolean;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function Button({
  children,
  id,
  leftIcon,
  rightIcon,
  href,
  fullWidth,
  onClick,
  type,
  loading,
  disabled = false,
  component = 'button',
  size = 'sm',
  color = 'blue',
  variant = 'filled',
}: PropsWithChildren<ButtonProps>) {
  const { classes } = useStyles({ variant, color, fullWidth });

  return (
    <MantineButton
      component={component}
      href={href}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      classNames={classes}
      size={size}
      type={type}
      fullWidth={fullWidth}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      id={id}
    >
      {children}
    </MantineButton>
  );
}
