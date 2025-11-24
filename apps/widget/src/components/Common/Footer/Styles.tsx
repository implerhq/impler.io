/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { createStyles, MantineTheme } from '@mantine/core';

export const getWrapperStyles = (theme: MantineTheme): React.CSSProperties => ({
  flexDirection: 'column-reverse',
  justifyContent: 'space-between',
  [`@media (min-width: ${theme.breakpoints.md}px)`]: {
    flexDirection: 'row',
  },
});

export const getPoweredByLinkStyles = (theme: MantineTheme): React.CSSProperties => ({
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.xs,
});

export const getImplerImageStyles = (theme: MantineTheme): React.CSSProperties => ({
  display: 'inline',
  height: 17,
  filter: 'var(--logo-filter, invert(0.5) brightness(1.5))',
  transition: 'filter 0.2s ease',
});

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    wrapper: getWrapperStyles(theme),
    poweredBy: getPoweredByLinkStyles(theme),
    implerImage: getImplerImageStyles(theme),
  };
});
