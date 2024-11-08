import { colors } from '@config';
import { MantineTheme, createStyles } from '@mantine/core';

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    recommendedBadge: {
      position: 'absolute',
      top: 1,
      left: 0,
      padding: theme.spacing.sm,
      borderRadius: 0,
    },
    planName: {
      textAlign: 'center',
      fontSize: theme.fontSizes.lg,
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
