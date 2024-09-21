import { createStyles, MantineTheme } from '@mantine/core';
import { colors } from '../../config/colors.config';

const getRootStyles = (): React.CSSProperties => ({
  flexGrow: 1,
});

const getSuccessRootStyles = (theme: MantineTheme): React.CSSProperties => ({
  borderColor: colors.success,
  flexGrow: 1,
  borderWidth: 2,
  display: 'flex',
  borderRadius: 4,
  alignItems: 'center',
  position: 'relative',
  borderStyle: 'dashed',
  padding: theme.spacing.md,
  justifyContent: 'center',
});

const getIconStyles = () => ({
  height: 70,
});

const getCheckIconStyles = (theme) => ({
  height: 40,
  backgroundColor: colors.success,
  borderRadius: '50%',
  color: 'white',
  display: 'block',
  [`@media (min-width: ${theme.breakpoints.md}px)`]: {
    height: 50,
  },
});

const getWrapperStyles = () => ({
  width: '100%',
});

const getDropzoneInnerStyles = (): React.CSSProperties => ({
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    icon: getIconStyles(),
    successRoot: getSuccessRootStyles(theme),
    root: getRootStyles(),
    checkIcon: getCheckIconStyles(theme),
    wrapper: getWrapperStyles(),
    inner: getDropzoneInnerStyles(),
  };
});
