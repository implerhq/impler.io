import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
  stepperContainer: {
    marginBottom: theme.spacing.xl,
  },
  stepText: {
    color: theme.colors.gray[5],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
    marginBottom: theme.spacing.xs,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.dark[4],

    '& .mantine-Progress-bar': {
      backgroundColor: theme.colors.blue[5],
    },
  },
}));
