import useStyles from './NavItem.styles';
import { Flex, Text } from '@mantine/core';

interface NavItemProps {
  icon: any;
  title: string;
  active?: boolean;
}

export function NavItem({ icon, title, active }: NavItemProps) {
  const { classes } = useStyles({ active });

  return (
    <Flex className={classes.root}>
      {icon}
      <Text size="lg">{title}</Text>
    </Flex>
  );
}
