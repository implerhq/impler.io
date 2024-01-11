import { createStyles, MantineTheme } from '@mantine/core';

export default createStyles((theme: MantineTheme) => {
  return {
    input: {
      borderRadius: 0,
      padding: theme.spacing.xs,
    },
    wrapper: {
      marginTop: 6,
    },
  };
});
