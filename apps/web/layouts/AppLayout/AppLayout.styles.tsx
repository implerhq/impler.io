import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme, { collapsed }: { collapsed: boolean }) => ({
  scrollAreaContent: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },

  root: {
    display: 'flex',
    height: '100vh',
  },

  aside: {
    width: collapsed ? 60 : 210,
    transition: 'width 0.3s ease',
    backgroundColor: theme.colors.dark[7],
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    alignItems: collapsed ? 'center' : 'stretch',
  },

  asideHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
  },

  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  logoContainer: {
    padding: theme.spacing.md,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 62,
  },

  content: {
    flex: 1,
    padding: theme.spacing.md,
    overflow: 'auto',
  },

  contentBox: {
    backgroundColor: theme.colors.dark[6],
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    boxShadow: theme.shadows.sm,
    height: '100%',
  },

  navSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: collapsed ? 'center' : 'stretch',
    padding: collapsed ? '0' : '0 8px',
  },

  userMenuContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: collapsed ? 'center' : 'stretch',
    padding: collapsed ? '0' : '0 8px',
  },
}));
