import { Flex, Text } from '@mantine/core';
import useStyles from './Divider.styles';

interface DividerProps {
  label: string;
  color?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function Divider({ label, orientation }: DividerProps) {
  const { classes } = useStyles({ orientation, size: 1 });

  return (
    <Flex direction={orientation === 'horizontal' ? 'row' : 'column'} justify="space-between" align="center">
      <div className={classes.line} />
      <Text color="var(--secondary-background)">{label}</Text>
      <div className={classes.line} />
    </Flex>
  );
}
