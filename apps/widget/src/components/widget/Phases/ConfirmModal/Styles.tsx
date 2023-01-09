/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { createStyles, MantineTheme } from '@mantine/core';

export const getActionsStyles = (theme: MantineTheme): React.CSSProperties => ({
  width: '100%',
  flexDirection: 'column',
  alignItems: 'stretch',
  [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
});

export const getWrapperStyles = (theme: MantineTheme): React.CSSProperties => ({
  flexDirection: 'column',
  textAlign: 'center',
});

export const getWarningIconStyles = (theme: MantineTheme): React.CSSProperties => ({
  width: 40,
  height: 40,
});

export default createStyles((theme: MantineTheme, params, getRef): Record<string, any> => {
  return {
    wrapper: getWrapperStyles(theme),
    actions: getActionsStyles(theme),
    warning: getWarningIconStyles(theme),
  };
});
