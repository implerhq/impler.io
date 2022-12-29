import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flexGrow: 1,
    position: 'relative',
  },
}));
