import { colors } from '@config';
import { createStyles, MantineTheme } from '@mantine/core';

const getRootStyles = (theme: MantineTheme): React.CSSProperties => ({
  backgroundColor: colors.BGPrimaryDark,
  padding: theme.spacing.sm,
});

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    root: getRootStyles(theme),
  };
});
