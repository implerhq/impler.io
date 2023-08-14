import { Text } from '@mantine/core';
import useStyles from './Card.styles';

export type Colors = 'default' | 'primary';

interface CardProps {
  title: string;
  subtitle: string | number;
  color?: Colors;
}

export function Card({ title, subtitle, color = 'default' }: CardProps) {
  const { classes } = useStyles({ color });

  return (
    <div className={classes.root}>
      <Text size="md">{title}</Text>
      <Text size="xl" className={classes.subtitle}>
        {subtitle}
      </Text>
    </div>
  );
}
