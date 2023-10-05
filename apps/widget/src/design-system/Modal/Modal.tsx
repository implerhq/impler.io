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
  const { children, onClose, opened, title, centered = true } = props;
  const { classes } = useStyles();

  return (
    <MantineModal
      size="100%"
      opened={opened}
      onClose={onClose}
      transitionProps={{
        duration: 1000,
        timingFunction: 'ease',
        transition: 'scale',
      }}
      overlayProps={{
        opacity: 0.4,
        blur: 0.8,
      }}
      title={title}
      centered={centered}
      classNames={classes}
    >
      {children}
    </MantineModal>
  );
}
