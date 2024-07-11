import { Text, UnstyledButton } from '@mantine/core';
import useStyles from './AddCard.styles';

interface AddCardProps {
  onClick: () => void;
}

export const AddCard = ({ onClick }: AddCardProps) => {
  const { classes } = useStyles();

  return (
    <UnstyledButton className={classes.addCard} onClick={onClick}>
      <Text fw="bold" size="sm">
        + Add New Card
      </Text>
    </UnstyledButton>
  );
};
