/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { createStyles, MantineTheme } from '@mantine/core';

export const getRootStyles = (theme: MantineTheme) => ({
  height: 35,
  paddingBlock: 5,
  paddingInline: 7,
  fontSize: theme.fontSizes.sm,
  [`@media (min-width: ${theme.breakpoints.md}px)`]: {
    height: 40,
    paddingBlock: 10,
    paddingInline: 15,
  },
});

export default createStyles((theme: MantineTheme, params, getRef): Record<string, any> => {
  return {
    root: getRootStyles(theme),
  };
});
