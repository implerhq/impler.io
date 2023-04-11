import { colors } from '@config';
import { createStyles, MantineTheme } from '@mantine/core';

const getInputStyles = (theme: MantineTheme): React.CSSProperties => ({
  borderRadius: 0,
  backgroundColor: theme.colorScheme === 'dark' ? colors.BGPrimaryDark : colors.BGPrimaryLight,
});

const getItemsWrapperStyles = (): React.CSSProperties => ({
  padding: 0,
});

const getDropdownStyles = (): React.CSSProperties => ({
  borderRadius: 0,
});

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    input: getInputStyles(theme),
    itemsWrapper: getItemsWrapperStyles(),
    dropdown: getDropdownStyles(),
    item: getDropdownStyles(),
  };
});
