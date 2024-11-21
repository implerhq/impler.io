import { colors } from '@config';
import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  alert: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: colors.faintYellow,
    border: `1px solid ${colors.goldenYellow}`,
    padding: theme.spacing.sm,
  },
  icon: {
    marginRight: 0,
    color: colors.goldenYellow,
    display: 'flex',
    alignItems: 'center',
  },

  wrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
}));
