import { PropsWithChildren } from 'react';
import { Modal as MantineModal } from '@mantine/core';
import useStyles from './Modal.style';

interface IModalProps extends JSX.ElementChildrenAttribute {
  title?: string;
  opened: boolean;
  centered?: boolean;
  onClose: () => void;
  overflow?: 'inside' | 'outside';
  size?: 'sm' | 'md' | 'lg' | '100%' | number;
}

export function Modal(props: PropsWithChildren<IModalProps>) {
  const { children, onClose, opened, size = '100%', overflow = 'inside', title, centered = true } = props;
  const { classes } = useStyles();

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
      classNames={{
        header: classes.header,
        modal: classes.modal,
      }}
    >
      {children}
    </MantineModal>
  );
}
