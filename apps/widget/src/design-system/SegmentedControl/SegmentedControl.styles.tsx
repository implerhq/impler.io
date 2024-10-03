import { createStyles } from '@mantine/core';

export default createStyles(() => {
  return {
    root: {
      borderRadius: 'var(--counts-border-radius)',
      backgroundColor: 'var(--counts-background)',
    },
    indicator: {
      borderRadius: 'var(--counts-border-radius)',
      backgroundColor: 'var(--counts-active-background)',
    },
    label: {
      marginBottom: 0,
    },
    control: {
      '&:last-of-type .mantine-SegmentedControl-label': {
        color: 'var(--error-color)',
      },
    },
  };
});
