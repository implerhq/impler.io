/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { createStyles, MantineTheme } from '@mantine/core';
import { colors } from '@config';

export const getContainerStyles = (theme: MantineTheme): React.CSSProperties => ({
  flexDirection: 'column',
  width: '100%',
  alignItems: 'unset',
});

export const getTextContainerStyles = (theme: MantineTheme): React.CSSProperties => ({
  justifyContent: 'space-between',
});

export const getWarningIconStyles = (theme: MantineTheme): React.CSSProperties => ({
  backgroundColor: colors.lightDanger,
  borderRadius: '100%',
  padding: 2,
});

export default createStyles((theme: MantineTheme, params, getRef): Record<string, any> => {
  return {
    container: getContainerStyles(theme),
    textContainer: getTextContainerStyles(theme),
    warningIcon: getWarningIconStyles(theme),
  };
});
