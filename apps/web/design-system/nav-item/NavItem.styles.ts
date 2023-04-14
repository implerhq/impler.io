import { colors } from '@config';
import { createStyles, MantineTheme } from '@mantine/core';

const getRootFilledStyles = (theme: MantineTheme, isActive?: boolean) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: theme.spacing.xs,
  color: isActive ? colors.blue : theme.colorScheme === 'dark' ? colors.TXTGray : colors.TXTLight,
  paddingInline: theme.spacing.sm,
  flexWrap: 'nowrap',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  paddingBlock: theme.spacing.xs,
  position: 'relative',
  '&:hover': {
    color: colors.blue,
  },
  '&:hover:before': {
    content: '""',
    display: 'block',
    width: '3px',
    height: '100%',
    backgroundColor: colors.blue,
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: '0 3px 3px 0',
  },
  ...(isActive && {
    '&:before': {
      content: '""',
      display: 'block',
      width: '3px',
      height: '100%',
      backgroundColor: colors.blue,
      position: 'absolute',
      top: 0,
      left: 0,
      borderRadius: '0 3px 3px 0',
    },
  }),
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
