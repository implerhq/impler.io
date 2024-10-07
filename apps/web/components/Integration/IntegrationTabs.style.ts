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
    padding: 8,
    border: `1px solid rgba(255, 255, 255, 0.5)`,
    borderRadius: 0,
    transition: 'all 0.2s ease',

    '&:hover': {
      backgroundColor: colors.darkGrey,
      cursor: 'pointer',
    },

    '&[data-active]': {
      backgroundColor: colors.blue,
      color: theme.white,
      border: `1px solid ${colors.blue}`,
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
