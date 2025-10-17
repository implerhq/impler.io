import { PropsWithChildren } from 'react';
import { Title, Flex, Stack, Switch, Collapse, Group } from '@mantine/core';

import useStyles from './DestinationItem.styles';
import { colors } from '@config';
import { TooltipLink } from '@components/guide-point';
// import { ForbiddenIcon } from '@assets/icons';

interface DestinationItemProps extends PropsWithChildren {
  title: string;
  subtitle: string;
  onClick?: () => void;
  active?: boolean;
  tooltipLink?: string;
  disabled?: boolean;
}

export const DestinationItem = ({
  title,
  subtitle,
  onClick,
  children,
  active,
  tooltipLink,
  disabled,
}: DestinationItemProps) => {
  const { classes } = useStyles();

  return (
    <Stack
      className={classes.container}
      p="lg"
      spacing={children ? 'sm' : 0}
      data-disabled={disabled}
      style={{
        pointerEvents: disabled ? 'none' : 'auto',
      }}
    >
      <Flex justify="space-between" align="center">
        <Stack spacing={2}>
          <Group spacing="xs" align="center" noWrap>
            <Title color={disabled ? colors.TXTSecondaryDark : colors.white} order={4}>
              {title}
            </Title>
            {tooltipLink && <TooltipLink link={tooltipLink} iconSize="md" />}
          </Group>
          <Title order={5} fw="normal" color={colors.TXTSecondaryDark}>
            {subtitle}
          </Title>
        </Stack>
        <Switch
          color={disabled ? 'gray' : colors.blue}
          checked={!!active}
          onChange={disabled ? undefined : onClick}
          disabled={disabled}
        />
      </Flex>
      {!disabled && <Collapse in={!!active}>{children}</Collapse>}
    </Stack>
  );
};

DestinationItem.displayName = 'DestinationItem';
