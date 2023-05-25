import { colors } from '@config';
import { createStyles, MantineTheme } from '@mantine/core';

const getInputStyles = (theme: MantineTheme): React.CSSProperties => ({
  borderRadius: 0,
  padding: theme.spacing.xs,
  //   border: `1px solid ${hasError ? colors.danger : colors.StrokeSecondaryDark}`,
  backgroundColor: theme.colorScheme === 'dark' ? colors.BGPrimaryDark : colors.BGPrimaryLight,
});

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    input: getInputStyles(theme),
  };
});
