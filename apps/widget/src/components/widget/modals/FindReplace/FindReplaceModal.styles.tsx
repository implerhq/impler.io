import { createStyles, MantineTheme } from '@mantine/core';

export const useStyles = createStyles((theme: MantineTheme) => ({
  modal: {
    backgroundColor: 'var(--background-color)',
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.md,
    padding: theme.spacing.xl,
    color: 'var(--text-color)',
  },

  header: {
    marginBottom: '1rem',
    color: 'var(--text-color)',
  },

  title: {
    color: 'var(--text-color)',
    fontWeight: 600,
    fontSize: theme.fontSizes.xl,
  },

  label: {
    color: 'var(--label-color)',
    fontWeight: 500,
    fontSize: theme.fontSizes.lg,
  },

  input: {
    color: 'var(--text-color)',
    backgroundColor: 'var(--background-color)',
    borderColor: 'var(--border-color)',

    '&::placeholder': {
      color: 'var(--secondary-text-color)',
    },

    '&:focus': {
      borderColor: 'var(--button-primary-background)',
    },
  },

  select: {
    '& .mantine-Select-input': {
      color: 'var(--text-color)',
      backgroundColor: 'var(--background-color)',
      borderColor: 'var(--border-color)',
    },

    '& .mantine-Select-label': {
      color: 'var(--label-color)',
      fontWeight: 500,
      fontSize: theme.fontSizes.lg,
    },

    '& .mantine-Select-dropdown': {
      backgroundColor: 'var(--background-color)',
      borderColor: 'var(--border-color)',
    },

    '& .mantine-Select-item': {
      backgroundColor: 'var(--background-color)',
      color: 'var(--text-color)',

      '&:hover': {
        backgroundColor: 'var(--stepper-background)',
      },

      '&[data-selected]': {
        backgroundColor: 'var(--button-primary-background)',
        color: 'var(--button-primary-color)',
      },
    },
  },

  checkbox: {
    '& .mantine-Checkbox-input': {
      borderColor: 'var(--border-color)',
      backgroundColor: 'var(--background-color)',

      '&:checked': {
        backgroundColor: 'var(--button-primary-background)',
        borderColor: 'var(--button-primary-background)',
      },
    },

    '& .mantine-Checkbox-label': {
      color: 'var(--text-color)',
      fontWeight: 500,
      fontSize: theme.fontSizes.lg,
    },
  },

  // Additional utility classes for consistent theming
  text: {
    color: 'var(--text-color)',
  },

  secondaryText: {
    color: 'var(--secondary-text-color)',
  },

  labelText: {
    color: 'var(--label-color)',
  },
}));
