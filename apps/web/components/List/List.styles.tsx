import { createStyles } from '@mantine/core';

export const getListStyles = createStyles((theme) => ({
  list: {
    width: '100%',
  },
  header: {
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
  },
  row: {
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
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
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
  },
  emptyText: {
    padding: theme.spacing.xl,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
  },
}));
