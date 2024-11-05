import { colors } from '@config';
import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme, { numOfPaymentMethods }: { numOfPaymentMethods: number }) => ({
  scrollArea: {
    height: Math.min(numOfPaymentMethods * 70, 120),
    overflowX: 'hidden',
    overflowY: 'auto',
    position: 'relative',
    display: 'block',
    width: '100%',
    boxSizing: 'border-box',
  },

  scrollAreaContent: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },

  scrollbar: {
    '&[data-orientation="vertical"]': {
      width: 10,
      backgroundColor: colors.StrokeLight,
      opacity: 0,
      height: '100%',
    },
    '&[data-orientation="vertical"] .mantine-ScrollArea-thumb': {
      backgroundColor: colors.blue,
      opacity: 0,
      '&:hover': {
        backgroundColor: colors.blue,
      },

      height: '100%',
    },
    '&:hover': {
      opacity: 1,
    },
    '&[data-orientation="vertical"]:hover .mantine-ScrollArea-thumb': {
      opacity: 1,
    },
  },
}));
