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

export const getMappingWrapperStyles = (theme: MantineTheme): React.CSSProperties => ({
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  paddingRight: 5,
});

export default createStyles((theme: MantineTheme, params, getRef): Record<string, any> => {
  return {
    textWrapper: getTextWrapperStyles(theme),
    mappingWrapper: getMappingWrapperStyles(theme),
  };
});
