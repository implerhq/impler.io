import { colors } from '@config';
import { createStyles, MantineTheme } from '@mantine/core';

const getRootStyles = (theme: MantineTheme): React.CSSProperties => ({
  padding: 10,
  width: '100%',
  borderRadius: 7,
  marginBottom: 10,
  color: colors.TXTSecondaryDark,
  backgroundColor: theme.colorScheme === 'dark' ? colors.BGPrimaryDark : colors.BGPrimaryLight,

  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
});

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    root: getRootStyles(theme),
  };
});
