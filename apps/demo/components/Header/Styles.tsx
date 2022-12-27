/* eslint-disable no-magic-numbers */
import { colors } from '@config';
import { createStyles } from '@mantine/core';

export default createStyles((theme, height: number) => ({
  root: {
    position: 'sticky',
    zIndex: 1,
    backgroundColor: colors.black,
    borderBottomColor: colors.lightGray,
  },

  dropdown: {
    position: 'absolute',
    top: height,
    left: 0,
    right: 0,
    zIndex: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderBottomWidth: 0,
    overflow: 'hidden',
    backgroundColor: colors.black,
    borderColor: colors.lightGray,

    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    backgroundColor: colors.white,
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: colors.white,
    fontSize: theme.fontSizes.sm,
    fontWeight: 'bold',

    '&:hover': {
      color: colors.goldenrod,
    },

    [theme.fn.smallerThan('sm')]: {
      borderBottom: `0.5px solid ${colors.lightGray}`,
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },
}));
