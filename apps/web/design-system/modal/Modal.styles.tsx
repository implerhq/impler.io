import { colors } from '@config';
import { createStyles, MantineTheme } from '@mantine/core';

const getModalStyles = (theme: MantineTheme): React.CSSProperties => ({
  backgroundColor: theme.colorScheme === 'dark' ? colors.BGPrimaryDark : colors.BGPrimaryLight,
});

const getTitleStyles = (theme: MantineTheme): React.CSSProperties => ({
  color: theme.colorScheme === 'dark' ? colors.white : colors.black,
});

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    modal: getModalStyles(theme),
    title: getTitleStyles(theme),
  };
});
