/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { createStyles, MantineTheme } from '@mantine/core';
import { colors } from '../../config/colors.config';

export const getContainerStyles = (theme: MantineTheme): React.CSSProperties => ({
  borderColor: colors.lightDeem,
  borderWidth: 1,
  borderStyle: 'solid',
  borderRadius: 4,
  padding: theme.spacing.xs,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
});

export const getFileIconStyles = (theme: MantineTheme): React.CSSProperties => ({
  color: colors.darkDeem,
  height: '20px',
  width: '20px',
});

export const getCrossIconStyles = (theme: MantineTheme): React.CSSProperties => ({
  color: colors.danger,
  height: '25px',
  cursor: 'pointer',
});

export const getNameTextStyles = (theme: MantineTheme): React.CSSProperties => ({
  color: colors.darkDeem,
  fontWeight: 'bold',
  textOverflow: 'ellipsis',
  width: '100%',
  maxWidth: '105px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
    maxWidth: '300px',
  },
  [`@media (min-width: ${theme.breakpoints.md}px)`]: {
    maxWidth: '400px',
  },
});

export const getExtensionTextStyles = (theme: MantineTheme): React.CSSProperties => ({
  color: colors.darkDeem,
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
});

export const getSizeTextStyles = (theme: MantineTheme): React.CSSProperties => ({
  display: 'none',
  [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
    display: 'block',
  },
  color: colors.darkDeem,
});

export default createStyles((theme: MantineTheme, params, getRef): Record<string, any> => {
  return {
    root: getContainerStyles(theme),
    fileIcon: getFileIconStyles(theme),
    crossIcon: getCrossIconStyles(theme),
    nameText: getNameTextStyles(theme),
    sizeText: getSizeTextStyles(theme),
    extensionText: getExtensionTextStyles(theme),
  };
});
