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
  variant?: ButtonVariants;
  href?: string;
}

export function Button({
  children,
  leftIcon,
  rightIcon,
  href,
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
    >
      {children}
    </MantineButton>
  );
}
