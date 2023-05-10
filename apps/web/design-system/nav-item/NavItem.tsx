import useStyles from './NavItem.styles';
import { Flex, Text } from '@mantine/core';
import Link from 'next/link';

interface NavItemProps {
  icon: any;
  title: string;
  active?: boolean;
  href: string;
}

export function NavItem({ icon, title, active, href }: NavItemProps) {
  const { classes } = useStyles({ active });

  return (
    <Link href={href} className={classes.link}>
      <Flex className={classes.root}>
        {icon}
        <Text size="lg">{title}</Text>
      </Flex>
    </Link>
  );
}
