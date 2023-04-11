import { colors } from '@config';
import { createStyles, MantineTheme } from '@mantine/core';

const getRootStyles = (theme: MantineTheme): React.CSSProperties => ({
  borderRadius: 0,
  backgroundColor: theme.colorScheme === 'dark' ? colors.BGPrimaryDark : colors.BGPrimaryLight,
});

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    input: getRootStyles(theme),
  };
});
