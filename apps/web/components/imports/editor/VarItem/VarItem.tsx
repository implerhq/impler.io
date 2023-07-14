import { UnstyledButton, Text } from '@mantine/core';
import useStyles from './VarItem.styles';

interface VarItemProps {
  name: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export const VarItem = ({ name, onClick, icon }: VarItemProps) => {
  const { classes } = useStyles();

  return (
    <UnstyledButton onClick={onClick} className={classes.root}>
      <Text>{name}</Text>
      {icon}
    </UnstyledButton>
  );
};
