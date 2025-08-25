import { colors } from '@config';
import { createStyles, MantineTheme } from '@mantine/core';

export const getTableStyles = (theme: MantineTheme) => ({
  whiteSpace: 'nowrap',
  color: colors.TXTDark,
  'thead tr th': {
    position: 'sticky',
    top: 0,
    'z-index': 1,
    padding: theme.spacing.xs,
    color: colors.TXTDark,
    background: colors.BGTertiaryDark,
  },
  'tbody tr td': {
    padding: theme.spacing.xs,
  },
});

export const getHeadingStyles = (): React.CSSProperties => ({
  backgroundColor: colors.StrokeDark,
});

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    table: getTableStyles(theme),
    heading: getHeadingStyles(),
  };
});
