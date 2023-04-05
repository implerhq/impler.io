import { colors } from '@config';
import { createStyles, MantineTheme } from '@mantine/core';

const getRootFilledStyles = (theme: MantineTheme, isActive?: boolean): React.CSSProperties => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: theme.spacing.xs,
  color: isActive ? colors.blue : colors.TXTSecondaryDark,
  paddingInline: theme.spacing.sm,
  flexWrap: 'nowrap',
  borderLeft: isActive ? `2px solid ${colors.blue}` : 'none',
});

interface Params {
  active?: boolean;
}

export default createStyles((theme: MantineTheme, params: Params): Record<string, any> => {
  return {
    root: getRootFilledStyles(theme, params.active),
  };
});
