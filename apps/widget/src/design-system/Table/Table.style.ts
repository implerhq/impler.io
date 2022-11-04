/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { createStyles, MantineTheme } from '@mantine/core';
import { colors } from '../../config/colors.config';

export const getTableStyles = (theme: MantineTheme) => ({
  textAlign: 'center',
  overflow: 'auto',
  display: 'block',
  whiteSpace: 'nowrap',
});

export const getHeadingStyles = (theme: MantineTheme): React.CSSProperties => ({
  backgroundColor: colors.lightGray,
});

export const getInvalidColumnStyles = (theme: MantineTheme): React.CSSProperties => ({
  backgroundColor: colors.lightDanger,
});

export default createStyles((theme: MantineTheme, params, getRef): Record<string, any> => {
  return {
    table: getTableStyles(theme),
    heading: getHeadingStyles(theme),
    invalidColumn: getInvalidColumnStyles(theme),
  };
});
