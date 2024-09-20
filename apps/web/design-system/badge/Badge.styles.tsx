import { createStyles } from '@mantine/core';

export default createStyles((): Record<string, any> => {
  return {
    inner: {
      textTransform: 'none',
    },
    root: {
      padding: `0 calc(10px /1.5)`,
    },
  };
});
