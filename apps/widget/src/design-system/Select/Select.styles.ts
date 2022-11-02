/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { colors } from '../../config/colors.config';
import { createStyles, MantineTheme } from '@mantine/core';

export const getLabelStyles = (theme: MantineTheme): React.CSSProperties => ({
  fontWeight: 'bold',
});

export const getSelectStyles = (theme: MantineTheme): React.CSSProperties => ({
  color: colors.darkDeem,
  cursor: 'pointer',
});

export default createStyles((theme: MantineTheme, params, getRef): Record<string, any> => {
  return {
    label: getLabelStyles(theme),
    select: getSelectStyles(theme),
  };
});
