/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { createStyles, MantineTheme } from '@mantine/core';
import { colors } from '@config';

const getRootStyles = (theme: MantineTheme): React.CSSProperties => ({
  backgroundColor: colors.blue,
  borderRadius: '0px',
});

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    root: getRootStyles(theme),
  };
});
