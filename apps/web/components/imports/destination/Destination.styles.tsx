import { createStyles } from '@mantine/core';

export default createStyles((): Record<string, any> => {
  return {
    control: {
      '&:disabled': {
        opacity: 1,
        cursor: 'pointer',
      },
    },
  };
});
