import React, { PropsWithChildren, ReactNode, forwardRef } from 'react';
import { Button as MantineButton, MantineSize } from '@mantine/core';
import useStyles from './Button.styles';

interface IButtonProps {
  variant?: 'filled' | 'outline';
  disabled?: boolean;
  visiblyDisabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  size?: MantineSize;
  type?: 'submit' | 'reset' | 'button';
  color?: 'blue' | 'red' | 'gray' | string;
  leftIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, PropsWithChildren<IButtonProps>>(
  (
    {
      variant,
      disabled,
      children,
      loading,
      onClick,
      visiblyDisabled,
      type = 'button',
      size = 'md',
      color,
      leftIcon,
      fullWidth,
      ...rest
    },
    ref
  ) => {
    const { classes } = useStyles();

    return (
      <MantineButton
        ref={ref}
        leftIcon={leftIcon}
        disabled={disabled}
        variant={variant}
        loading={loading}
        onClick={(e) => {
          if (visiblyDisabled) e.preventDefault();
          else onClick?.();
        }}
        data-variant={variant}
        data-color={color}
        {...(visiblyDisabled && { 'data-disabled': true })}
        sx={{ '&[data-disabled]': { pointerEvents: 'all' } }}
        size={size}
        type={type}
        color={color}
        classNames={classes}
        fullWidth={fullWidth}
        {...rest}
      >
        {children}
      </MantineButton>
    );
  }
);

Button.displayName = 'Button';
