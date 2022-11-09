/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { createStyles, MantineTheme } from '@mantine/core';

export const getTextWrapperStyles = (theme: MantineTheme): React.CSSProperties => ({
  [`@media (max-width: ${theme.breakpoints.md}px)`]: {
    width: '100%',
  },
  [`@media (min-width: ${theme.breakpoints.md}px)`]: {
    width: '70%',
  },
});

export default createStyles((theme: MantineTheme, params, getRef): Record<string, any> => {
  return {
    textWrapper: getTextWrapperStyles(theme),
  };
});
