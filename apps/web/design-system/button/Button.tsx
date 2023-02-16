import useStyles from './Button.styles';
import { Button as MantineButton, MantineSize } from '@mantine/core';

interface ButtonProps {
  leftIcon?: any;
  rightIcon?: any;
  colorScheme?: 'blue';
  children?: any;
  size?: MantineSize;
  component?: 'button' | 'a';
  href?: string;
}

export function Button({ children, leftIcon, rightIcon, href, component = 'button', size = 'md' }: ButtonProps) {
  const { classes } = useStyles();

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
