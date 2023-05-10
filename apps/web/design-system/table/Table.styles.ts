/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { colors } from '@config';
import { createStyles, MantineTheme } from '@mantine/core';

export const getTableStyles = (theme: MantineTheme) => ({
  whiteSpace: 'nowrap',
  color: theme.colorScheme === 'dark' ? colors.TXTDark : colors.TXTLight,
  'thead tr th': {
    position: 'sticky',
    top: 0,
    'z-index': 1,
    padding: theme.spacing.xs,
    color: theme.colorScheme === 'dark' ? colors.TXTDark : colors.TXTLight,
    background: theme.colorScheme === 'dark' ? colors.BGTertiaryDark : colors.BGTertiaryLight,
  },
  'tbody tr td': {
    padding: theme.spacing.xs,
  },
});

export const getHeadingStyles = (theme: MantineTheme): React.CSSProperties => ({
  backgroundColor: colors.StrokeDark,
});

export default createStyles((theme: MantineTheme, params, getRef): Record<string, any> => {
  return {
    table: getTableStyles(theme),
    heading: getHeadingStyles(theme),
  };
});
