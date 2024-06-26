/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { createStyles, MantineTheme } from '@mantine/core';

export const getIndicatorStyles = (theme: MantineTheme): React.CSSProperties => ({
  paddingLeft: 0,
  paddingRight: 0,
  width: '1.7rem',
  cursor: 'pointer',
  height: '1.7rem !important',
  transform: 'translate(30%, -30%) !important',
});

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    indicator: getIndicatorStyles(theme),
  };
});
