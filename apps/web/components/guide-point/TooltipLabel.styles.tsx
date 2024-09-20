import { createStyles, MantineTheme } from '@mantine/core';

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    label: {
      fontWeight: 500,
      fontSize: '0.875rem',
      color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[9],
    },
  };
});
