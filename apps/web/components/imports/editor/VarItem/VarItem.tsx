import { forwardRef } from 'react';
import { UnstyledButton, Text } from '@mantine/core';

import useStyles from './VarItem.styles';

interface VarItemProps {
  name: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export const VarItem = forwardRef<HTMLButtonElement, VarItemProps>(({ name, onClick, icon }: VarItemProps, ref) => {
  const { classes } = useStyles();

  return (
    <UnstyledButton onClick={onClick} className={classes.root} ref={ref}>
      <Text truncate>{name}</Text>
      {icon}
    </UnstyledButton>
  );
});

VarItem.displayName = 'VarItem';
