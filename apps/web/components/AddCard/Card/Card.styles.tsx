import { colors } from '@config';
import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  card: {
    borderRadius: theme.radius.md,
    backgroundColor: theme.colorScheme === 'dark' ? colors.BGPrimaryDark : colors.BGPrimaryLight,
  },
}));
