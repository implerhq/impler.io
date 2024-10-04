import { createStyles } from '@mantine/core';

export const getListStyles = createStyles((theme) => ({
  list: {
    width: '100%',
  },
  header: {
    padding: theme.spacing.md,
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    textAlign: 'left',
    marginBottom: theme.spacing.xl,
  },
  row: {
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    '&:last-child': {
      borderBottom: 'none',
    },
    cursor: 'pointer',
  },
  td: {
    padding: theme.spacing.sm,
    textAlign: 'left',
  },
  th: {
    padding: theme.spacing.sm,
  },
  selectedRow: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
  },
  emptyText: {
    padding: theme.spacing.xl,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
  },
}));
