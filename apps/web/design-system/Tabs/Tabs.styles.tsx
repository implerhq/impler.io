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
  position: 'relative',
});

const getTabIconStyles = (theme: MantineTheme) => ({
  width: 20,
  height: 20,
  marginRight: theme.spacing.xs,
  backgroundColor: theme.colorScheme === 'dark' ? colors.BGSecondaryDark : colors.BGSecondaryLight,
  borderRadius: 20,
  '& path': {
    fill: theme.colorScheme === 'dark' ? colors.white : colors.black,
  },
});
const getTabLabelStyles = (theme: MantineTheme) => ({
  fontSize: theme.fontSizes.md,
});

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    tabsList: getTabListStyles(theme),
    tab: getTabStyles(theme),
    tabLabel: getTabLabelStyles(theme),
    panel: getPanelStyles(theme),
    tabIcon: getTabIconStyles(theme),
  };
});
