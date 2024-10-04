import { createStyles } from '@mantine/core';

export const getListStyles = createStyles((theme) => ({
  list: {
    width: '100%',
  },
  header: {
    padding: theme.spacing.md,
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    display: 'grid',
    gridTemplateColumns: '3fr 2fr 1fr 1fr',
    gap: theme.spacing.md,
    alignItems: 'center',
    '& > :nth-last-child(-n+2)': {
      textAlign: 'center',
    },
    '& > *': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  row: {
    padding: theme.spacing.sm,
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    '&:last-child': {
      borderBottom: 'none',
    },
    cursor: 'pointer',
    /*
     * '&:hover': {
     *   backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
     * },
     */
    display: 'grid',
    gridTemplateColumns: '3fr 2fr 1fr 1fr',
    gap: theme.spacing.md,
    alignItems: 'center',
    '& > :nth-last-child(-n+2)': {
      justifySelf: 'center',
    },
    '& > *': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      minWidth: 0,
    },
    '& > :first-child': {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
  },
  selectedRow: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
  },
  emptyText: {
    padding: theme.spacing.xl,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
  },
}));
