import { colors } from '@config';
import { createStyles } from '@mantine/core';

export default createStyles((): Record<string, any> => {
  return {
    root: {
      backgroundColor: 'transparent',
    },
    input: {
      color: colors.white,
    },
  };
});
