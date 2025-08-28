import { colors } from '@config';
import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  root: {
    color: colors.TXTDark,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      width: '100%',
    },
  },
  selectInput: {
    backgroundColor: colors.BGSecondaryDark,
    color: colors.TXTDark,
    borderColor: colors.DisabledDark,
    '&:focus-within': {
      borderColor: colors.DisabledDark,
    },
    width: 120,
  },
  item: {
    borderRadius: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    borderColor: colors.StrokeDark,
    transition: 'background-color 0.2s, color 0.2s ease-in-out',
    '&:not([data-disabled]):hover': {
      backgroundColor: colors.blue,
      color: colors.white,
    },
    '&[disabled]': { backgroundColor: 'transparent' },
    '&[data-active]': { backgroundColor: colors.blue },
    '&[data-dots]': { color: colors.white },
  },
}));
