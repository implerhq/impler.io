import { colors } from '@config';
import { createStyles, CSSObject, MantineTheme } from '@mantine/core';

const getRootFilledStyles = (theme: MantineTheme, isActive?: boolean): CSSObject => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: theme.spacing.xs,
  color: isActive ? theme.white : colors.TXTGray,
  paddingLeft: theme.spacing.sm,
  flexWrap: 'nowrap',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  paddingBlock: theme.spacing.xs,
  position: 'relative',
  borderRadius: theme.radius.xs,
  backgroundColor: isActive ? colors.blue : 'transparent',
  paddingRight: theme.spacing.xs,
  label: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    transition: 'opacity 0.2s ease, width 0.3s ease',
    opacity: 1,
    width: 'auto',

    '&[data-collapsed="true"]': {
      opacity: 0,
      width: 0,
    },
  },

  '&:hover': {
    backgroundColor: isActive ? colors.blue : theme.colors.dark[5],
    color: theme.white,
  },

  '& svg': {
    color: isActive ? theme.white : colors.TXTGray,
    transition: 'color 0.2s ease',
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
