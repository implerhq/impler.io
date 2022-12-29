import { createStyles } from '@mantine/core';

export default createStyles((theme, height: number) => ({
  container: {
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      height: `calc(100vh - ${height}px)`,
    },
  },
}));
