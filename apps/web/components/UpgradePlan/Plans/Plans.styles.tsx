import { colors } from '@config';
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
    recommendedBadge: {
      position: 'absolute',
      top: 1,
      left: 0,
      padding: '20px 10px',
      borderRadius: 0,
    },
    planName: {
      textAlign: 'center',
      fontWeight: 500,
      fontSize: theme.fontSizes.md,
    },
    planPrice: {
      textAlign: 'center',
      fontSize: theme.spacing.xl,
      fontWeight: 700,
    },
    button: {
      width: '100%',
      color: colors.white,
      radius: '0px',
      '&:disabled': {
        backgroundColor: theme.colors.gray,
        color: colors.white,
        cursor: 'not-allowed',
      },
    },
  };
});
