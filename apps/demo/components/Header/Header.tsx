import React from 'react';
import Image from 'next/image';
import useStyles from './Styles';
import Container from '@components/Container';
import { useDisclosure } from '@mantine/hooks';
import { Header, Group, Burger, Paper, Transition, Flex } from '@mantine/core';

interface HeaderResponsiveProps {
  links: { link: string; label: string }[];
  height: number;
}

const HeaderResponsive = ({ links, height }: HeaderResponsiveProps) => {
  const [opened, { toggle, close }] = useDisclosure(false);

  const { classes } = useStyles(height);

  const items = links.map((link) => (
    <a key={link.label} href={link.link} className={classes.link} onClick={close} target="_blank" rel="noreferrer">
      {link.label}
    </a>
  ));

  return (
    <Header height={height} className={classes.root}>
      <Container>
        <Flex justify="space-between" align="center">
          <Image src="/images/impler-dark.png" alt="Impler Logo" width={height} height={height} />
          <Group spacing={5} className={classes.links}>
            {items}
          </Group>

          <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />

          <Transition transition="pop-top-right" duration={200} mounted={opened}>
            {(styles) => (
              <Paper className={classes.dropdown} withBorder style={styles} top={height}>
                {items}
              </Paper>
            )}
          </Transition>
        </Flex>
      </Container>
    </Header>
  );
};

HeaderResponsive.displayName = 'HeaderResponsive';

export default HeaderResponsive;
