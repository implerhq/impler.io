import { colors } from '@config';
import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  addCard: {
    display: 'flex',
    cursor: 'pointer',
    color: colors.blue,
    alignItems: 'center',
    minHeight: 185,
    justifyContent: 'center',
    transition: `color 0.3s ease, background-color 0.3s ease`,
    borderRadius: theme.radius.md,
    border: `1px solid ${colors.blue}`,
    ':hover': {
      color: colors.white,
      backgroundColor: colors.blue,
    },
  },
}));
