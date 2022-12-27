import { colors } from '@config';
import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  root: {
    border: `1px solid ${colors.lightGray}`,
    backgroundColor: colors.lightGray,
    color: colors.cyan,
    padding: '12px',
    borderRadius: 0,
  },
  list: {
    marginBlock: '5px',
    paddingLeft: theme.spacing.xl,
  },
  message: {
    color: colors.white,
  },
}));
