/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { createStyles, MantineTheme } from '@mantine/core';
import { colors } from '../../config/colors.config';

export const getRootStyles = (theme: MantineTheme): React.CSSProperties => ({
  justifyContent: 'space-between',
});

export const getSelectionRootStyles = (theme: MantineTheme): React.CSSProperties => ({
  borderColor: colors.lightDeem,
  borderWidth: 1,
  borderStyle: 'solid',
  borderRadius: 4,
  padding: 0,
  width: '70%',
});

export const getHeadingStyles = (theme: MantineTheme) => ({
  padding: theme.spacing.xs,
  backgroundColor: colors.light,
  display: 'flex',
  alignItems: 'center',
  width: '50%',
  position: 'relative',
  borderTopLeftRadius: 4,
  borderBottomLeftRadius: 4,
  '&:after': {
    content: '""',
    position: 'absolute',
    background: 'url("arrow.svg")',
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    width: 17,
    height: '100%',
    left: '100%',
    top: 0,
    zIndex: 10,
  },
});

export const getSelectStyles = (theme: MantineTheme, height: number): React.CSSProperties => ({
  border: 'none',
  height: height,
  cursor: 'pointer',
});

export const getSelectRootStyles = (theme: MantineTheme): React.CSSProperties => ({
  width: '50%',
});

export const getStatusTextStyles = (theme: MantineTheme): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.sm,
});

export default createStyles((theme: MantineTheme, params: { height: number }, getRef): Record<string, any> => {
  return {
    root: getRootStyles(theme),
    statusText: getStatusTextStyles(theme),
    selectionRoot: getSelectionRootStyles(theme),
    selectRoot: getSelectRootStyles(theme),
    select: getSelectStyles(theme, params.height),
    heading: getHeadingStyles(theme),
  };
});
