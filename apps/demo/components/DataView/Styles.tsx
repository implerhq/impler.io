import { colors } from '@config';
import { createStyles } from '@mantine/core';

export default createStyles(() => ({
  tableWrapper: {
    border: `1px solid ${colors.darkGray}`,
    flexGrow: 1,
    width: '100%',
    overflow: 'auto',
  },
  thead: {
    th: {
      backgroundColor: colors.lightGray,
      color: colors.white + ' !important',
      fontWeight: 'bold',
      padding: '10px !important',
      borderBottom: `1px solid ${colors.darkGray} !important`,
    },
    'th:not(:last-child)': {
      borderRight: `1px solid ${colors.darkGray} !important`,
    },
  },
  tbody: {
    color: colors.white,
  },
  td: {
    borderBottom: `1px solid ${colors.darkGray} !important`,
    borderRight: `1px solid ${colors.darkGray} !important`,
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
}));
