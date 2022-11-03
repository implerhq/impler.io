/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { createStyles, MantineTheme } from '@mantine/core';
import { colors } from '../../config/colors.config';

export const getHeaderStyles = (theme: MantineTheme): React.CSSProperties => ({
  marginBottom: theme.spacing.xs,
  marginRight: 0,
});

export const getModalStyles = (theme: MantineTheme): React.CSSProperties => ({
  padding: '100px',
});

export default createStyles((theme: MantineTheme, params, getRef): Record<string, any> => {
  return {
    header: getHeaderStyles(theme),
    modal: getModalStyles(theme),
  };
});
