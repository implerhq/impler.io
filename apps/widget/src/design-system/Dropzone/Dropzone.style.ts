/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { createStyles, MantineTheme } from '@mantine/core';
import { colors } from '../../config/colors.config';

export const getRootStyles = (theme: MantineTheme, hasError: boolean): React.CSSProperties => ({
  borderColor: hasError ? colors.red : colors.primary,
  flexGrow: 1,
});

export const getSuccessRootStyles = (theme: MantineTheme): React.CSSProperties => ({
  borderColor: colors.success,
  borderWidth: 2,
  borderStyle: 'dashed',
  padding: theme.spacing.md,
  borderRadius: 4,
  position: 'relative',
  flexGrow: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const getIconStyles = (theme) => ({
  height: 70,
});

export const getCheckIconStyles = (theme) => ({
  height: 60,
  backgroundColor: colors.success,
  borderRadius: '50%',
  color: 'white',
  display: 'block',
});

export const getWrapperStyles = (theme) => ({
  width: '100%',
});

export const getDropzoneInnerStyles = (theme: MantineTheme): React.CSSProperties => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
});

export default createStyles((theme: MantineTheme, { hasError }: { hasError: boolean }, getRef): Record<string, any> => {
  return {
    icon: getIconStyles(theme),
    successRoot: getSuccessRootStyles(theme),
    root: getRootStyles(theme, hasError),
    checkIcon: getCheckIconStyles(theme),
    wrapper: getWrapperStyles(theme),
    inner: getDropzoneInnerStyles(theme),
  };
});
