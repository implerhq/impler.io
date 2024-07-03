import { colors } from '@config';
import { createStyles, MantineTheme } from '@mantine/core';

const getRootStyles = (): React.CSSProperties => ({
  height: '100vh',
  display: 'flex',
  position: 'relative',
});

const getAsideStyles = (): React.CSSProperties => ({
  width: 'calc(100vw - 85%)',
  minWidth: '150px',
});

const getLogoContainerStyles = (theme: MantineTheme): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  paddingBlock: theme.spacing.lg,
  paddingLeft: theme.spacing.md,
  justifyContent: 'center',
});

const getMainStyles = (theme: MantineTheme): React.CSSProperties => ({
  width: '100%',
  padding: theme.spacing.lg,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
});

const getContentStyles = (theme: MantineTheme): React.CSSProperties => ({
  paddingTop: theme.spacing.md,
  flexGrow: 1,
});

const getContentBoxStyles = (theme: MantineTheme): React.CSSProperties => ({
  backgroundColor: theme.colorScheme === 'dark' ? colors.BGSecondaryDark : colors.BGSecondaryLight,
  width: '100%',
  height: '100%',
  borderRadius: theme.radius.lg,
  padding: theme.spacing.lg,
});

export default createStyles((theme): Record<string, any> => {
  return {
    root: getRootStyles(),
    aside: getAsideStyles(),
    main: getMainStyles(theme),
    content: getContentStyles(theme),
    contentBox: getContentBoxStyles(theme),
    logoContainer: getLogoContainerStyles(theme),
  };
});
