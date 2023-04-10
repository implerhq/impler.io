import useStyles from './Button.styles';
import { Button as MantineButton, MantineSize } from '@mantine/core';

export type ButtonColors = 'blue' | 'white';
export type ButtonVariants = 'filled' | 'outline';

interface ButtonProps {
  leftIcon?: any;
  rightIcon?: any;
  color?: ButtonColors;
  children?: any;
  size?: MantineSize;
  component?: 'button' | 'a';
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariants;
  href?: string;
  fullWidth?: boolean;
  onClick?: () => void;
}

export function Button({
  children,
  leftIcon,
  rightIcon,
  href,
  fullWidth,
  onClick,
  type,
  component = 'button',
  size = 'sm',
  color = 'blue',
  variant = 'filled',
}: ButtonProps) {
  const { classes } = useStyles({ variant, color });

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
    >
      {children}
    </MantineButton>
  );
}
