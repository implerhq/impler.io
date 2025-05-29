import { createStyles } from '@mantine/core';

export const useStyles = createStyles(() => ({
  stickyFooter: {
    position: 'sticky',
    zIndex: 1000,
    bottom: 0,
    top: 0,
  },
}));
