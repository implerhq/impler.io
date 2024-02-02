import { MouseEvent, PropsWithChildren } from 'react';
import { Tooltip, UnstyledButton, UnstyledButtonProps } from '@mantine/core';

interface IconButtonProps extends UnstyledButtonProps {
  label: string;
  withArrow?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}
export function IconButton({
  label,
  onClick,
  withArrow = true,
  children,
  ...buttonProps
}: PropsWithChildren<IconButtonProps>) {
  return (
    <Tooltip label={label} withArrow={withArrow}>
      <UnstyledButton onClick={onClick} {...buttonProps}>
        {children}
      </UnstyledButton>
    </Tooltip>
  );
}
