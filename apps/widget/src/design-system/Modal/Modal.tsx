import { PropsWithChildren } from 'react';
import { Modal as MantineModal } from '@mantine/core';

interface IModalProps extends JSX.ElementChildrenAttribute {
  title?: string;
  opened: boolean;
  centered?: boolean;
  onClose: () => void;
  overflow?: 'inside' | 'outside';
  size?: 'sm' | 'md' | 'lg' | '100%' | number;
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
}

export function Modal(props: PropsWithChildren<IModalProps>) {
  const {
    children,
    onClose,
    opened,
    size = '100%',
    padding = 'sm',
    overflow = 'inside',
    title,
    centered = true,
  } = props;

  return (
    <MantineModal
      onClose={onClose}
      opened={opened}
      transitionDuration={1000}
      transitionTimingFunction="ease"
      transition="scale"
      size={size}
      centered={centered}
      overflow={overflow}
      title={title}
      padding={padding}
    >
      {children}
    </MantineModal>
  );
}
