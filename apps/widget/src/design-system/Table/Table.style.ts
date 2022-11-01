/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { createStyles, MantineTheme } from '@mantine/core';
import { colors } from '../../config/colors.config';

export const getTableStyles = (theme: MantineTheme) => ({});

export const getHeadingStyles = (theme: MantineTheme): React.CSSProperties => ({
  backgroundColor: colors.lightGray,
});

export default createStyles((theme: MantineTheme, params, getRef): Record<string, any> => {
  return {
    table: getTableStyles(theme),
    heading: getHeadingStyles(theme),
  };
});
