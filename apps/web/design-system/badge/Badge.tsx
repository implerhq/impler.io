import { Badge as MantineBadge, BadgeProps as MantineBadgeProps } from '@mantine/core';

import useStyles from './Badge.styles';

type BadgeProps = MantineBadgeProps;

export function Badge(props: BadgeProps) {
  const { classes } = useStyles();

  return <MantineBadge classNames={classes} {...props} />;
}
