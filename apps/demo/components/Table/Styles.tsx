import { colors } from '@config';
import { createStyles } from '@mantine/core';

export default createStyles(() => ({
  tableWrapper: {
    border: `1px solid ${colors.darkGray}`,
    flexGrow: 1,
    width: '100%',
    overflow: 'auto',
    maxHeight: 500,
    /* scrollbar */
    '&::-webkit-scrollbar': {
      width: '7px',
      height: '7px',
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 3px grey',
      borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: colors.gray,
      borderRadius: '10px',
    },
  },
  thead: {
    position: 'sticky',
    top: 0,
    th: {
      backgroundColor: colors.lightGray,
      color: colors.white + ' !important',
      fontWeight: 'bold',
      padding: '10px !important',
      borderBottom: `1px solid ${colors.darkGray} !important`,
      whiteSpace: 'nowrap',
    },
    'th:not(:last-child)': {
      borderRight: `1px solid ${colors.darkGray} !important`,
    },
  },
  tbody: {
    color: colors.white,
    td: {
      borderBottom: `1px solid ${colors.darkGray} !important`,
      borderRight: `1px solid ${colors.darkGray} !important`,
    },
  },
}));
