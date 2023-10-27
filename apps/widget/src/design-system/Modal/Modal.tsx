import { PropsWithChildren } from 'react';
import useStyles from './Modal.style';
import { Modal as MantineModal } from '@mantine/core';
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
      trapFocus
      onClose={onClose}
      opened={opened}
      overlayProps={{
        opacity: 0.4,
        blur: 0.8,
      }}
      centered={centered}
      title={title}
      classNames={classes}
    >
      {children}
    </MantineModal>
  );
}
