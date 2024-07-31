import { PropsWithChildren } from 'react';
import { Title, useMantineColorScheme, Flex, Stack, Switch, Collapse, Tooltip, Group, Box } from '@mantine/core';

import useStyles from './DestinationItem.styles';
import { colors } from '@config';
import { GuidePointIcon } from '@assets/icons/GuidePoint.icon';

interface DestinationItemProps extends PropsWithChildren {
  title: string;
  subtitle: string;
  onClick?: () => void;
  active?: boolean;
  tooltipLink?: string;
}

export const DestinationItem = ({ title, subtitle, onClick, children, active, tooltipLink }: DestinationItemProps) => {
  const { colorScheme } = useMantineColorScheme();
  const { classes } = useStyles({ colorScheme });

  return (
    <Stack className={classes.container} p="lg" spacing={children ? 'sm' : 0}>
      <Flex justify="space-between" align="center">
        <Stack spacing={2}>
          <Group spacing="xs" align="center" noWrap>
            <Title color={colorScheme === 'dark' ? colors.white : colors.black} order={4}>
              {title}
            </Title>
            {tooltipLink && (
              <Tooltip label="Read more" position="top" withArrow>
                <Box component="a" href={tooltipLink} target="_blank" rel="noopener noreferrer">
                  <GuidePointIcon size="lg" color={colorScheme === 'dark' ? colors.white : colors.black} />
                </Box>
              </Tooltip>
            )}
          </Group>
          <Title order={5} fw="normal" color={colors.TXTSecondaryDark}>
            {subtitle}
          </Title>
        </Stack>
        <Flex align="center" gap="md">
          <Switch color={colors.blue} checked={!!active} onClick={onClick} />
        </Flex>
      </Flex>
      <Collapse in={!!active}>{children}</Collapse>
    </Stack>
  );
};

DestinationItem.displayName = 'DestinationItem';
