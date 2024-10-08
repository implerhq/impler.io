import { colors } from '@config';
import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
  tabsList: {
    border: 'none',
    overflow: 'auto',
    flexWrap: 'nowrap',
    gap: theme.spacing.xs,
    paddingBottom: theme.spacing.xs,
    borderBottom: `1px solid ${colors.StrokeDark}`,
    ':hover': {
      cursor: 'move',
    },
  },
  tab: {
    backgroundColor: 'transparent',
    color: theme.colorScheme === 'dark' ? colors.StrokeLight : colors.StrokeDark,
    fontWeight: 400,
    fontSize: theme.fontSizes.sm,
    padding: 8,
    border: `0.5px solid ${colors.DisabledDark}`,
    borderRadius: 0,
    transition: 'all 0.2s ease',
    boxShadow: `0 0 0 1px ${theme.fn.rgba(colors.StrokeLight, 0.1)}`,

    '&:hover': {
      backgroundColor: theme.fn.rgba(colors.darkGrey, 0.5),
      cursor: 'pointer',
    },

    '&[data-active]': {
      backgroundColor: colors.blue,
      color: theme.white,
      border: `1px solid ${colors.blue}`,
      boxShadow: `0 0 0 1px ${theme.fn.rgba(colors.blue, 0.5)}`,
      '&:hover': {
        backgroundColor: colors.blue,
        color: theme.white,
      },
    },
  },
  panel: {
    marginTop: theme.spacing.md,
    height: '50vh',
  },
}));
