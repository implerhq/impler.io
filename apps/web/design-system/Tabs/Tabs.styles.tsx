import { colors } from '@config';
import { createStyles, MantineTheme } from '@mantine/core';

const getTabListStyles = (): React.CSSProperties => ({
  padding: 5,
  backgroundColor: colors.BGPrimaryDark,
});

const getTabStyles = () => ({
  flexGrow: 1,
  color: colors.white,
  borderRadius: 0,
  '&:hover': {
    backgroundColor: colors.BGSecondaryDark,
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
  backgroundColor: colors.BGSecondaryDark,
  borderRadius: 20,
  '& path': {
    fill: colors.white,
  },
});
const getTabLabelStyles = (theme: MantineTheme) => ({
  fontSize: theme.fontSizes.md,
});

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    tabsList: getTabListStyles(),
    tab: getTabStyles(),
    tabLabel: getTabLabelStyles(theme),
    panel: getPanelStyles(theme),
    tabIcon: getTabIconStyles(theme),
  };
});
