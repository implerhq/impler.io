import { createStyles } from '@mantine/core';

export const getListStyles = createStyles((theme) => ({
  list: {
    width: '100%',
  },
  header: {
    borderBottom: `1px solid ${theme.colors.dark[4]}`,
  },
  row: {
    borderBottom: `1px solid ${theme.colors.dark[4]}`,
  },
  td: {
    textAlign: 'left',
    padding: `${theme.spacing.sm} !important`,
  },
  th: {
    textAlign: 'left',
    padding: theme.spacing.xs,
  },
  selectedRow: {
    backgroundColor: theme.colors.dark[5],
  },
  emptyText: {
    padding: theme.spacing.xl,
    color: theme.colors.dark[2],
  },
}));
