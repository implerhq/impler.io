import { colors } from '@config';
import { createStyles, MantineTheme } from '@mantine/core';

const getRootStyles = (theme: MantineTheme): React.CSSProperties => ({
  backgroundColor: theme.colorScheme === 'dark' ? colors.BGPrimaryDark : colors.BGPrimaryLight,
  boxShadow: theme.shadows.sm,
  padding: theme.spacing.md,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing.xs,
});

const getURLSyles = (): React.CSSProperties => ({
  color: colors.blue,
  textDecoration: 'underline',
});
const getCopyButtonStyles = (): React.CSSProperties => ({
  lineHeight: 1,
});

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    root: getRootStyles(theme),
    url: getURLSyles(),
    button: getCopyButtonStyles(),
  };
});
