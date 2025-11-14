import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
  stepperContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.dark[5],
    borderRadius: theme.radius.xl,
    minWidth: 50,
    height: 50,
  },
  stepText: {
    color: theme.white,
    fontSize: theme.fontSizes.md,
    fontWeight: 600,
    lineHeight: 1,
    letterSpacing: '0.5px',
  },
}));
