/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { createStyles, MantineTheme } from '@mantine/core';
import { variables } from '../../config/variable.config';

export const getRootStyles = (theme: MantineTheme): React.CSSProperties => ({
  borderColor: theme.colors.primary[variables.colorIndex],
  flexGrow: 1,
});

export const getBrowseTextStyles = (theme: MantineTheme): React.CSSProperties => ({
  color: theme.colors.primary[variables.colorIndex],
});

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    root: getRootStyles(theme),
    browseText: getBrowseTextStyles(theme),
  };
});
