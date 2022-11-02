/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { colors } from '../../config/colors.config';
import { createStyles, MantineTheme } from '@mantine/core';

export const getLabelStyles = (theme: MantineTheme): React.CSSProperties => ({
  fontWeight: 'bold',
  color: colors.black,
});

export const getSelectStyles = (theme: MantineTheme): React.CSSProperties => ({
  color: colors.darkDeem,
  cursor: 'pointer',
});

export const getRootStyles = (theme: MantineTheme, width: string | number): React.CSSProperties => ({
  width,
});

export default createStyles(
  (theme: MantineTheme, { width }: { width: string | number }, getRef): Record<string, any> => {
    return {
      label: getLabelStyles(theme),
      select: getSelectStyles(theme),
      root: getRootStyles(theme, width),
    };
  }
);
