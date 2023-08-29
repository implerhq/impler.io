/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { colors } from '@config';
import { createStyles, MantineTheme } from '@mantine/core';

export const getWrapperStyles = (theme: MantineTheme): React.CSSProperties => ({
  flexDirection: 'column-reverse',
  justifyContent: 'space-between',
  [`@media (min-width: ${theme.breakpoints.md}px)`]: {
    flexDirection: 'row',
  },
});

export const getPoweredByLinkStyles = (theme: MantineTheme): React.CSSProperties => ({
  color: colors.black,
  textDecoration: 'none',
});

export const getImplerImageStyles = (theme: MantineTheme): React.CSSProperties => ({
  display: 'inline',
  marginLeft: 2,
  height: 17,
  marginTop: 1,
});

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    wrapper: getWrapperStyles(theme),
    poweredBy: getPoweredByLinkStyles(theme),
    implerImage: getImplerImageStyles(theme),
  };
});
