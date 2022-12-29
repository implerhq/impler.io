import { colors } from '@config';
import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: colors.white,
  },
  selectInput: {
    backgroundColor: colors.darkGray,
    color: 'white',
    borderColor: colors.lightGray,
    ':focus-within': { borderColor: colors.white },
  },
  item: {
    color: colors.white,
    borderRadius: 0,
    borderWidth: 0,
    backgroundColor: colors.black,
    borderColor: colors.lightGray,
    '&[disabled]': { backgroundColor: 'transparent' },
    '&[data-active]': { backgroundColor: colors.purple },
    '&[data-dots]': { color: 'white' },
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
