import { colors } from '@config';
import { createStyles, MantineTheme } from '@mantine/core';

const getInputStyles = (theme: MantineTheme): React.CSSProperties => ({
  borderRadius: 0,
  backgroundColor: theme.colorScheme === 'dark' ? colors.BGSecondaryDark : colors.BGSecondaryLight,
});

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    input: getInputStyles(theme),
    itemsWrapper: {
      padding: 0,
    },
    dropdown: {
      borderRadius: 0,
    },
    item: {
      borderRadius: 0,
    },
  };
});
