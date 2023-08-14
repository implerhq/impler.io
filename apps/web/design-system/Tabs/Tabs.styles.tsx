import { colors } from '@config';
import { createStyles, MantineTheme } from '@mantine/core';

const getTabListStyles = (theme: MantineTheme): React.CSSProperties => ({
  padding: 5,
  backgroundColor: theme.colorScheme === 'dark' ? colors.BGPrimaryDark : colors.BGPrimaryLight,
});

const getTabStyles = (theme: MantineTheme) => ({
  flexGrow: 1,
  color: theme.colorScheme === 'dark' ? colors.white : colors.black,
  borderRadius: 0,
  '&:hover': {
    backgroundColor: theme.colorScheme === 'dark' ? colors.BGSecondaryDark : colors.BGSecondaryLight,
  },
  '&[aria-selected="true"]': {
    backgroundColor: `${colors.blue} !important`,
  },
});

const getPanelStyles = (theme: MantineTheme): React.CSSProperties => ({
  paddingTop: theme.spacing.xs,
});

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    tabsList: getTabListStyles(theme),
    tab: getTabStyles(theme),
    panel: getPanelStyles(theme),
  };
});
