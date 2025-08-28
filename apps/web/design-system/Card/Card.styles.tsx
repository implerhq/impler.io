import { colors } from '@config';
import { createStyles, MantineTheme } from '@mantine/core';
import { Colors } from './Card';

const getRootStyles = (theme: MantineTheme, color: Colors): React.CSSProperties => ({
  border: `1px solid ${colors.BGSecondaryDark}`,
  ...(color === 'primary' && {
    backgroundColor: colors.blue,
    color: colors.white,
  }),
  ...(color === 'default' && {
    backgroundColor: colors.BGPrimaryDark,
    color: colors.TXTDark,
  }),
  boxShadow: theme.shadows.sm,
  padding: theme.spacing.md,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xs,
  borderRadius: theme.radius.sm,
});

const getSubtitleStyles = (theme: MantineTheme): React.CSSProperties => ({
  fontWeight: 600,
  fontSize: theme.fontSizes.xl,
});

interface Params {
  color: Colors;
}

export default createStyles((theme: MantineTheme, params: Params): Record<string, any> => {
  return {
    root: getRootStyles(theme, params.color),
    subtitle: getSubtitleStyles(theme),
  };
});
