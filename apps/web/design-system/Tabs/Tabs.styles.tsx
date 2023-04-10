import { colors } from '@config';
import { createStyles, MantineTheme } from '@mantine/core';

const getTabListStyles = (theme: MantineTheme): React.CSSProperties => ({
  padding: 5,
  backgroundColor: theme.colorScheme === 'dark' ? colors.BGSecondaryDark : colors.BGSecondaryLight,
});

const getTabStyles = (theme: MantineTheme) => ({
  color: theme.colorScheme === 'dark' ? colors.white : colors.black,
  borderRadius: 0,
  '&:hover': {
    backgroundColor: theme.colorScheme === 'dark' ? colors.BGPrimaryDark : colors.BGPrimaryLight,
  },
  '&[aria-selected="true"]': {
    backgroundColor: `${colors.blue} !important`,
  },
});

const getRootStyles = () => ({
  width: 'max-content',
});

const getPanelStyles = (theme: MantineTheme): React.CSSProperties => ({
  paddingTop: theme.spacing.xs,
});

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    tabsList: getTabListStyles(theme),
    tab: getTabStyles(theme),
    root: getRootStyles(),
    panel: getPanelStyles(theme),
  };
});
