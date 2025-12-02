import { PropsWithChildren } from 'react';
import { Title, Flex, Stack, Switch, Collapse, Group, Badge } from '@mantine/core';
import { Button } from '@ui/button';

import useStyles from './DestinationItem.styles';
import { colors, ROUTES } from '@config';
import { TooltipLink } from '@components/guide-point';
import { LockIcon } from '@assets/icons/Lock.icon';

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
    <>
      {disabled ? (
        <Flex
          direction="row"
          gap="sm"
          align="center"
          p="xs"
          bg={colors.BGSecondaryDark}
          style={{
            border: `1px solid ${colors.StrokeDark}`,
          }}
        >
          <LockIcon size="xl" color="#868e96" />
          <Stack spacing={5} w="100%" align="flex-start">
            <Badge color="orange">Premium Feature</Badge>
            <div>
              <Title color={disabled ? colors.TXTSecondaryDark : colors.white} order={4}>
                {title}
              </Title>
              <Title order={5} fw="normal" color={colors.TXTSecondaryDark}>
                {subtitle}
              </Title>
            </div>
          </Stack>
          <Button
            component="a"
            size="xs"
            href={ROUTES.EXPLORE_PLANS}
            onClick={() => {
              window.location.href = ROUTES.EXPLORE_PLANS;

              return false;
            }}
          >
            Upgrade
          </Button>
        </Flex>
      ) : (
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
      )}
    </>
  );
};

DestinationItem.displayName = 'DestinationItem';
