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
  const { classes } = useStyles();
  const { children, onClose, opened, centered = true } = props;

  return (
    <MantineModal
      trapFocus
      onClose={onClose}
      opened={opened}
      overlayProps={{
        opacity: 0.4,
        blur: 0.8,
      }}
      withCloseButton={false}
      centered={centered}
      classNames={classes}
    >
      {children}
    </MantineModal>
  );
}
