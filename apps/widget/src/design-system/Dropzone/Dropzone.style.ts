/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { createStyles, MantineTheme } from '@mantine/core';
import { colors } from '../../config/colors.config';

export const getRootStyles = (theme) => ({
  borderColor: colors.primary,
});

export const getIconStyles = (theme) => ({
  height: 70,
});

export default createStyles((theme: MantineTheme, params, getRef) => {
  return {
    icon: getIconStyles(theme),
    root: getRootStyles(theme),
  };
});
