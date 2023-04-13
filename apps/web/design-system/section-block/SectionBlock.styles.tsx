import { colors } from '@config';
import { createStyles, MantineTheme } from '@mantine/core';

const getRootStyles = (theme: MantineTheme): React.CSSProperties => ({
  backgroundColor: theme.colorScheme === 'dark' ? colors.BGPrimaryDark : colors.BGPrimaryLight,
  padding: theme.spacing.sm,
});

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    root: getRootStyles(theme),
  };
});
