import { createStyles, MantineTheme } from '@mantine/core';
import { colors } from '../../config/colors.config';

const getRootStyles = (theme: MantineTheme): React.CSSProperties => ({
  justifyContent: 'space-between',
  width: '100%',
  [`@media (max-width: ${theme.breakpoints.md}px)`]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 3,
  },
});

const getSelectionWrapperStyles = (theme: MantineTheme): React.CSSProperties => ({
  width: '70%',
  [`@media (max-width: ${theme.breakpoints.md}px)`]: {
    width: '100%',
  },
});

const getSelectionRootStyles = (): React.CSSProperties => ({
  borderColor: 'var(--border-color)',
  borderWidth: 1,
  borderStyle: 'solid',
  borderRadius: 'var(--border-radius)',
  padding: 0,
});

const getHeadingStyles = (theme: MantineTheme) => ({
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

export const getSelectRootStyles = (): React.CSSProperties => ({
  width: '50%',
});

export const getStatusTextStyles = (theme: MantineTheme): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.sm,
  [`@media (max-width: ${theme.breakpoints.md}px)`]: {
    flexDirection: 'row-reverse',
  },
});

export const getRequiredStyles = (): React.CSSProperties => ({
  color: 'var(--error-color)',
});

export default createStyles((theme: MantineTheme, params: { height: number }): Record<string, any> => {
  return {
    root: getRootStyles(theme),
    statusText: getStatusTextStyles(theme),
    selectionWrapper: getSelectionWrapperStyles(theme),
    selectionRoot: getSelectionRootStyles(),
    selectRoot: getSelectRootStyles(),
    select: getSelectStyles(theme, params.height),
    heading: getHeadingStyles(theme),
    required: getRequiredStyles(),
  };
});
