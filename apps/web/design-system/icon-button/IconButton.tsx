import { Tooltip, UnstyledButton } from '@mantine/core';
import { PropsWithChildren } from 'react';

interface IconButtonProps {
  label: string;
  withArrow?: boolean;
  onClick?: () => void;
}
export function IconButton({ label, onClick, withArrow = true, children }: PropsWithChildren<IconButtonProps>) {
  return (
    <Tooltip label={label} withArrow={withArrow}>
      <UnstyledButton onClick={onClick}>{children}</UnstyledButton>
    </Tooltip>
  );
}
