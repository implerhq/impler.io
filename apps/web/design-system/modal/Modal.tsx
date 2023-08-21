import { Flex, Modal as MantineModal, Title } from '@mantine/core';
import useStyles from './Modal.styles';

interface ModalProps extends React.PropsWithChildren {
  opened: boolean;
  onClose: () => void;
  title?: string;
  footerActions?: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
}

export function Modal({ title, children, footerActions, size = 'lg', onClose, opened }: ModalProps) {
  const { classes } = useStyles();

  return (
    <MantineModal size={size} classNames={classes} opened={opened} centered onClose={onClose} withCloseButton={false}>
      {title && (
        <Title order={2} className={classes.title}>
          {title}
        </Title>
      )}
      {children}
      <Flex justify="flex-end" gap="xs">
        {footerActions}
      </Flex>
    </MantineModal>
  );
}
