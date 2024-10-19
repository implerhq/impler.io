import { MouseEvent, PropsWithChildren } from 'react';
import { Tooltip, UnstyledButton, UnstyledButtonProps } from '@mantine/core';

interface IconButtonProps extends UnstyledButtonProps {
  label: string;
  disabled?: boolean;
  withArrow?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}
export function IconButton({
  label,
  onClick,
  disabled = false,
  withArrow = true,
  children,
  ...buttonProps
}: PropsWithChildren<IconButtonProps>) {
  return (
    <Tooltip label={label} withArrow={withArrow}>
      <UnstyledButton onClick={onClick} disabled={disabled} {...buttonProps}>
        {children}
      </UnstyledButton>
    </Tooltip>
  );
}
