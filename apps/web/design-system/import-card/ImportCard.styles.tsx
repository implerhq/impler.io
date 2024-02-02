import { colors } from '@config';
import { createStyles, CSSObject, MantineTheme } from '@mantine/core';

const getRootStyles = (theme: MantineTheme) => ({
  height: '100%',
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
    textDecoration: 'none',
  },
  [`@media only screen and (max-width: ${theme.breakpoints.sm}px)`]: {
    padding: theme.spacing.xs,
  },
});

const getNameStyles = (theme: MantineTheme): CSSObject => ({
  color: theme.colorScheme === 'dark' ? colors.white : colors.black,
  fontWeight: 600,
  fontSize: theme.fontSizes.xl,
});

const getKeyStyles = (theme: MantineTheme): CSSObject => ({
  color: colors.TXTSecondaryDark,
  fontSize: theme.fontSizes.sm,
});

const getDuplicateButtonStyles = (theme: MantineTheme): CSSObject => ({
  transition: 'color 0.2s ease-in-out',
  color: theme.colorScheme === 'dark' ? colors.white : colors.black,
  '&:hover': {
    color: colors.blueDark,
  },
});

const getValueStyles = (theme: MantineTheme): CSSObject => ({
  color: theme.colorScheme === 'dark' ? colors.white : colors.black,
  fontWeight: 600,
  fontSize: theme.fontSizes.sm,
});

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    key: getKeyStyles(theme),
    root: getRootStyles(theme),
    name: getNameStyles(theme),
    value: getValueStyles(theme),
    duplicate: getDuplicateButtonStyles(theme),
  };
});
