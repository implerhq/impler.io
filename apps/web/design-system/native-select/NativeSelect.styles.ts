import { colors } from '@config';
import { createStyles, MantineTheme } from '@mantine/core';

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    root: {
      backgroundColor: 'transparent',
    },
    input: {
      color: theme.colorScheme === 'dark' ? colors.white : colors.black,
    },
  };
});
