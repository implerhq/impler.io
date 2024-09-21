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
  color: theme.colors.primary[0],
  height: '20px',
  width: '20px',
});

export const getCrossIconStyles = (): React.CSSProperties => ({
  color: colors.danger,
  height: '25px',
  cursor: 'pointer',
});

export const getNameTextStyles = (theme: MantineTheme): React.CSSProperties => ({
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

export const getExtensionTextStyles = (): React.CSSProperties => ({
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
});

export const getSizeTextStyles = (theme: MantineTheme): React.CSSProperties => ({
  display: 'none',
  [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
    display: 'block',
  },
});

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    root: getContainerStyles(theme),
    fileIcon: getFileIconStyles(theme),
    crossIcon: getCrossIconStyles(),
    nameText: getNameTextStyles(theme),
    sizeText: getSizeTextStyles(theme),
    extensionText: getExtensionTextStyles(),
  };
});
