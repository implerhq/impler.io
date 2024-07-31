import { PropsWithChildren } from 'react';
import { Title, useMantineColorScheme, Flex, Stack, Switch, Collapse } from '@mantine/core';

import useStyles from './DestinationItem.styles';
import { colors } from '@config';

interface DestinationItemProps extends PropsWithChildren {
  title: string;
  subtitle: string;
  onClick?: () => void;
  active?: boolean;
}

export const DestinationItem = ({ title, subtitle, onClick, children, active }: DestinationItemProps) => {
  const { colorScheme } = useMantineColorScheme();
  const { classes } = useStyles({ colorScheme });

  return (
    <Stack className={classes.container} p="lg" spacing={children ? 'sm' : 0}>
      <Flex justify="space-between" align="center">
        <Stack spacing={0}>
          <Title color={colorScheme === 'dark' ? colors.white : colors.black} order={4}>
            {title}
          </Title>
          <Title order={5} fw="normal" color={colors.TXTSecondaryDark}>
            {subtitle}
          </Title>
        </Stack>
        <Switch color={colors.blue} checked={!!active} onClick={onClick} />
      </Flex>
      <Collapse in={!!active}>{children}</Collapse>
    </Stack>
  );
};

DestinationItem.displayName = 'DestinationItem';
