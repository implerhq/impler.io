import { Alert as MantineAlert, AlertProps as MantineAlertProps } from '@mantine/core';

import useStyles from './Alert.styles';

type AlertProps = MantineAlertProps;

export function Alert(props: AlertProps) {
  const { classes } = useStyles();

  return <MantineAlert classNames={classes} {...props} />;
}
