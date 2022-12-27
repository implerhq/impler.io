import { colors } from '@config';
import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  footer: {
    borderTop: `1px solid ${colors.lightGray}`,
    backgroundColor: colors.black,
    color: colors.gray,
    boxSizing: 'border-box',
    paddingBlock: theme.spacing.lg,
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column',
    gap: theme.spacing.sm,
    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      flexDirection: 'row',
    },
  },
  link: {
    color: colors.gray,
    textDecoration: 'none',
    '&:hover': {
      color: colors.goldenrod,
    },
  },
}));
