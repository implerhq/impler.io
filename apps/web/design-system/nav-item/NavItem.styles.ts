import { colors } from '@config';
import { createStyles, CSSObject, MantineTheme } from '@mantine/core';

const getRootFilledStyles = (theme: MantineTheme, isActive?: boolean): CSSObject => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: theme.spacing.xs,
  color: isActive ? colors.blue : theme.colorScheme === 'dark' ? colors.TXTGray : colors.TXTLight,
  paddingLeft: theme.spacing.sm,
  flexWrap: 'nowrap',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  paddingBlock: theme.spacing.xs,
  position: 'relative',
  '&:hover': {
    color: colors.blue,
  },
});

const getLinkStyles = () => ({
  '&:hover': {
    textDecoration: 'none',
  },
});

interface Params {
  active?: boolean;
}

export default createStyles((theme: MantineTheme, params: Params): Record<string, any> => {
  return {
    root: getRootFilledStyles(theme, params.active),
    link: getLinkStyles(),
  };
});
