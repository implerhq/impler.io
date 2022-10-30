import { PropsWithChildren } from 'react';
import { Button as MantineButton, MantineSize } from '@mantine/core';

interface IButtonProps {
  variant?: 'filled' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  size?: MantineSize;
  color?: 'blue' | 'red';
}

export function Button(props: PropsWithChildren<IButtonProps>) {
  const { variant, disabled, children, loading, onClick, size = 'md', color } = props;

  return (
    <MantineButton disabled={disabled} variant={variant} loading={loading} onClick={onClick} size={size} color={color}>
      {children}
    </MantineButton>
  );
}
