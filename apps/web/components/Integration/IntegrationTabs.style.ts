import { colors } from '@config';
import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
  tabsList: {
    border: 'none',
    gap: theme.spacing.xs,
  },
  tab: {
    backgroundColor: 'transparent',
    color: theme.white,
    fontWeight: 600,
    fontSize: theme.fontSizes.xs,
    padding: '8px 12px',
    border: `1px solid ${theme.fn.rgba(colors.StrokeLight, 0.3)}`,
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
    minHeight: '65vh',
  },
  content: {
    minHeight: '20vh',
  },
}));
