import { colors } from '@config';
import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  root: {
    color: colors.TXTSecondaryDark,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      width: '100%',
    },
  },
  selectInput: {
    backgroundColor: theme.colorScheme === 'dark' ? colors.BGSecondaryDark : colors.BGSecondaryLight,
    color: theme.colorScheme === 'dark' ? colors.TXTDark : colors.TXTLight,
    borderColor: colors.StrokeSecondaryDark,
    '&:focus-within': {
      borderColor: colors.StrokeSecondaryDark,
    },
  },
  item: {
    borderRadius: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    borderColor: colors.StrokeDark,
    transition: 'background-color 0.2s, color 0.2s ease-in-out',
    '&[disabled]': { backgroundColor: 'transparent' },
    '&[data-active]': { backgroundColor: colors.blue },
    '&[data-dots]': { color: theme.colorScheme === 'dark' ? colors.white : colors.black },
    '&:hover': { backgroundColor: colors.blue, color: colors.white },
  },
  statistics: {
    // do not show in mobile
    visibility: 'hidden',
    width: 0,
    height: 0,
    // show for bigger screens from mobile
    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      visibility: 'visible',
      width: 'auto',
      height: 'auto',
    },
  },
}));
