/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
import { createStyles, MantineTheme } from '@mantine/core';
import { colors, strokes } from '@config';

const getRootStyles = (theme: MantineTheme): React.CSSProperties => ({
  borderRadius: 0,
  borderWidth: strokes.sm,
  borderStyle: 'solid',
  borderColor: theme.colorScheme === 'dark' ? colors.white : colors.black,
});

const getActiveStyles = (theme: MantineTheme): React.CSSProperties => ({
  borderRadius: '0px',
  backgroundColor: colors.blue,
});

const getActiveLabelStyles = (theme: MantineTheme) => ({
  color: colors.white + ' !important',
});
const getLabelStyles = (theme: MantineTheme) => ({
  color: theme.colorScheme === 'dark' ? colors.white : colors.black,
  '&:hover': {
    color: theme.colorScheme === 'dark' ? colors.white : colors.black,
  },
});

export default createStyles((theme: MantineTheme): Record<string, any> => {
  return {
    root: getRootStyles(theme),
    active: getActiveStyles(theme),
    label: getLabelStyles(theme),
    labelActive: getActiveLabelStyles(theme),
  };
});
