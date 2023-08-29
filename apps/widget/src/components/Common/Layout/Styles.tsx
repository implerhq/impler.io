/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { createStyles, MantineTheme } from '@mantine/core';

export const getRootStyles = (theme: MantineTheme) => ({
  paddingBottom: 16,
  '@media (min-width: 768px)': {
    paddingRight: 24,
    paddingLeft: 24,
    paddingBottom: 24,
  },
  border: '1px solid transparent',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});

export const getContainerStyles = (theme: MantineTheme): React.CSSProperties => ({
  flexDirection: 'column',
  width: '100%',
  alignItems: 'unset',
  flexGrow: 1,
  display: 'flex',
  gap: theme.spacing.md,
});

export default createStyles((theme: MantineTheme, params, getRef): Record<string, any> => {
  return {
    root: getRootStyles(theme),
    container: getContainerStyles(theme),
  };
});
