import { colors } from '@config';
import { createStyles, MantineTheme } from '@mantine/core';

const getRootStyles = (theme: MantineTheme) => ({
  padding: theme.spacing.md,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.sm,
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  border: `1px solid ${colors.StrokeSecondaryDark}`,
  backgroundColor: theme.colorScheme === 'dark' ? colors.BGSecondaryDark : colors.BGSecondaryLight,
  '&:hover': {
    border: `1px solid ${colors.blueDark}`,
    boxShadow: theme.shadows.md,
  },
  [`@media only screen and (max-width: ${theme.breakpoints.sm}px)`]: {
    padding: theme.spacing.xs,
  },
});

const getNameStyles = (theme: MantineTheme): React.CSSProperties => ({
  color: theme.colorScheme === 'dark' ? colors.white : colors.black,
  fontWeight: 600,
  fontSize: theme.fontSizes.xl,
});

const getKeyStyles = (theme: MantineTheme): React.CSSProperties => ({
  color: colors.TXTSecondaryDark,
  fontSize: theme.fontSizes.sm,
});

const getValueStyles = (theme: MantineTheme): React.CSSProperties => ({
  color: theme.colorScheme === 'dark' ? colors.white : colors.black,
  fontWeight: 600,
  fontSize: theme.fontSizes.sm,
});

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    root: getRootStyles(theme),
    name: getNameStyles(theme),
    key: getKeyStyles(theme),
    value: getValueStyles(theme),
  };
});
