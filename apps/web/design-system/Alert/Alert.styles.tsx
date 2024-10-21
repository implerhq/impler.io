import { createStyles, MantineTheme } from '@mantine/core';

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    wrapper: {
      alignItems: 'center',
    },
    icon: {
      marginRight: theme.spacing.xs,
    },
  };
});
