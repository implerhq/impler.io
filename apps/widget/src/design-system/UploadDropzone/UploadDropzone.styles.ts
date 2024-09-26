import { createStyles, MantineTheme } from '@mantine/core';
import { colors } from '../../config/colors.config';
import { variables } from '../../config/variable.config';

export const getRootStyles = (theme: MantineTheme, hasError: boolean): React.CSSProperties => ({
  borderColor: hasError ? colors.red : theme.colors.primary[variables.colorIndex],
  backgroundColor: colors.lightGray,
});

export const getSuccessRootStyles = (theme: MantineTheme): React.CSSProperties => ({
  borderColor: colors.success,
  borderWidth: 2,
  borderStyle: 'dashed',
  padding: theme.spacing.md,
  borderRadius: 4,
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const getIconStyles = () => ({
  height: 70,
});

export const getCheckIconStyles = (theme) => ({
  height: 40,
  backgroundColor: colors.success,
  borderRadius: '50%',
  color: 'white',
  display: 'block',
  [`@media (min-width: ${theme.breakpoints.md}px)`]: {
    height: 50,
  },
});

export const getDropzoneInnerStyles = (): React.CSSProperties => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export default createStyles((theme: MantineTheme, { hasError }: { hasError: boolean }): Record<string, any> => {
  return {
    icon: getIconStyles(),
    successRoot: getSuccessRootStyles(theme),
    root: getRootStyles(theme, hasError),
    checkIcon: getCheckIconStyles(theme),
    inner: getDropzoneInnerStyles(),
  };
});
