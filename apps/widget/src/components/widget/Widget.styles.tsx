/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { createStyles, MantineTheme } from '@mantine/core';

export const getTitleStyles = (theme: MantineTheme) => ({
  display: 'block',
  [`@media (max-width: ${theme.spacing.md}px)`]: {
    display: 'none',
  },
});

export default createStyles((theme: MantineTheme, params, getRef): Record<string, any> => {
  return {
    title: getTitleStyles(theme),
  };
});
