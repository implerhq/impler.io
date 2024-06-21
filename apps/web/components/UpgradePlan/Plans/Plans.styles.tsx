import { MantineTheme, createStyles } from '@mantine/core';

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    table: {
      'thead > tr > th': {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: theme.fontSizes.lg,
        textWrap: 'nowrap',
        padding: theme.spacing.sm,
      },
      'tbody > tr td:first-of-type': {
        fontWeight: 'bold',
        fontSize: theme.fontSizes.lg,
        textWrap: 'nowrap',
        padding: theme.spacing.sm,
      },
      'tbody > tr td': {
        textAlign: 'center',
      },
    },
  };
});
