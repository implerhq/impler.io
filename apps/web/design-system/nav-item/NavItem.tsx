import Link from 'next/link';
import { Flex, Text } from '@mantine/core';
import { HTMLAttributeAnchorTarget } from 'react';
import useStyles from './NavItem.styles';

interface NavItemProps {
  icon: any;
  title: string;
  active?: boolean;
  href: string;
  target?: HTMLAttributeAnchorTarget;
}

export function NavItem({ target, icon, title, active, href }: NavItemProps) {
  const { classes } = useStyles({ active });

  return (
    <Link href={href} target={target} className={classes.link}>
      <Flex className={classes.root}>
        {icon}
        <Text size="lg">{title}</Text>
      </Flex>
    </Link>
  );
}
